const Db = require('../utils/database')
const Privilege = Db.import('../models/privilege')
const User = Db.import('../models/user')
const { SuccessModel, ErrorModel } = require('../utils/DataModel')
const escape = require('mysql2').escape
const {
    Auth
} = require('../common/function')

const getPrivilegeInfo = async (ctx) => {
    const uid = ctx.session.uid
    if (!uid) {
        return new ErrorModel('请先登录！')
    }
    const result = await Privilege.findAll({
        where: {
            uid: uid
        },
        attributes: ['right']
    })
    let privilegeList = []
    for (let i in result) {
        privilegeList.push(result[i].right)
    }
    ctx.session.privilege = JSON.stringify(privilegeList)
    return new SuccessModel(privilegeList)
}

const getPrivilegeList = async (ctx) => {
    if (!Auth(ctx, ['administrator'])) {
        return new ErrorModel('权限不足！')
    }
    const query = ctx.request.query
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    Privilege.hasOne(User, { foreignKey: 'uid', sourceKey: 'uid' })
    const result = await Privilege.findAndCountAll({
        offset: (page - 1) * limit,
        limit: limit,
        attributes: ['pid', 'uid', 'right', 'createdAt', 'updatedAt'],
        order: [['uid', 'ASC'], ['pid', 'ASC']],
        include: [
            {
                model: User,
                attributes: ['nickname']
            }
        ]
    })
    return new SuccessModel({ count: result.count, data: result.rows })
}

const deletePrivilege = async (ctx) => {
    const post = ctx.request.body
    const pid = post.pid
    const result = await Privilege.destroy({
        where: {
            pid: pid
        }
    })
    if (result !== 0) {
        return new SuccessModel('删除成功！')
    } else {
        return new ErrorModel('删除失败！')
    }
}

const addPrivilege = async (ctx) => {
    const post = ctx.request.body
    const count = await Privilege.count({
        where: {
            uid: post.uid,
            right: post.right,
        }
    })
    if (count) {
        return new ErrorModel('权限已存在！')
    }
    const result = await Privilege.create({
        uid: post.uid,
        right: post.right,
    })
    if (result) {
        return new SuccessModel({ uid: result.uid })
    } else {
        return new ErrorModel('更新问题失败！请联系管理员')
    }
}

module.exports = {
    getPrivilegeInfo,
    getPrivilegeList,
    deletePrivilege,
    addPrivilege
}