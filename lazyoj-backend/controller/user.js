const Db = require('../utils/database')
const User = Db.import('../models/user')
const LoginLog = Db.import('../models/loginlog')
const { SuccessModel, ErrorModel } = require('../utils/DataModel')
const {
    getGernericPssword,
    checkGernericPassword,
    getClientIP,
    Auth
} = require('../common/function')
const escape = require('mysql2').escape
const Sequelize = require('sequelize')


const getUserList = async (ctx) => {
    let filter = {}
    let attributes = []
    if (Auth(ctx, ['administrator'])) {
        filter.defunct = ['N', 'Y']
        attributes = ['uid', 'username', 'password', 'nickname', 'phone', 'email', 'submit', 'accepted', 'defunct', 'ip', 'language', 'school', 'token', 'createdAt', 'updatedAt']
    } else {
        filter.defunct = ['N']
        attributes = ['uid', 'username', 'nickname', 'phone', 'email', 'submit', 'accepted', 'language', 'school', 'createdAt', 'updatedAt']
    }
    const query = ctx.request.query
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const result = await User.findAndCountAll({
        where: filter,
        attributes: attributes,
        offset: (page - 1) * limit,
        limit: limit,
        order: [['uid', 'ASC']]
    })
    if (result) {
        return new SuccessModel({ count: result.count, data: result.rows })
    } else {
        return new ErrorModel('读取失败！')
    }
}

const getUserCount = async (ctx) => {
    let filter = {}
    if (Auth(ctx, ['administrator'])) {
        filter.defunct = ['N', 'Y']
    } else {
        filter.defunct = ['N']
    }
    const result = await User.count({
        where: filter
    })
    return new SuccessModel({ count: result })
}

const toggleUserStatus = async (ctx) => {
    if (!Auth(ctx, ['administrator'])) {
        return new ErrorModel('权限不足！')
    }
    const post = ctx.request.body
    const defunct = post.val || NULL
    if (defunct === "N") {
        return await enableUser(ctx)
    } else if (defunct === "Y") {
        return await disableUser(ctx)
    } else {
        return new ErrorModel('非法操作！')
    }
}

const enableUser = async (ctx) => {
    if (!Auth(ctx, ['administrator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const uid = post.uid
        const result = await User.update({
            defunct: "N"
        }, {
            where: {
                uid: uid
            }
        })
        if (result[0] > 0) {
            return new SuccessModel('修改成功！')
        } else {
            return new ErrorModel('修改失败！')
        }
    }
    catch {
        return new ErrorModel('修改失败！')
    }
}

const disableUser = async (ctx) => {
    if (!Auth(ctx, ['administrator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const uid = post.uid
        const result = await User.update({
            defunct: "Y"
        }, {
            where: {
                uid: uid
            }
        })
        if (result[0] > 0) {
            return new SuccessModel('修改成功！')
        } else {
            return new ErrorModel('修改失败！')
        }
    }
    catch {
        return new ErrorModel('修改失败！')
    }
}

const getUserLoginLog = async (ctx) => {
    if (!Auth(ctx, ['administrator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const query = ctx.request.query
        const page = parseInt(query.page)
        const limit = parseInt(query.limit)
        const uid = query.uid
        const result = await LoginLog.findAndCountAll({
            where: {
                uid: uid
            },
            offset: (page - 1) * limit,
            limit: limit,
            attributes: ['uid', 'ip', 'password', 'createdAt', 'updatedAt']
        })
        return new SuccessModel({ count: result.count, data: result.rows })
    }
    catch (err) {
        return new ErrorModel('读取失败！')
    }
}

const setUserLoginLog = async (ctx) => {
    if (!Auth(ctx, ['administrator'])) {
        return new ErrorModel('权限不足！')
    }
    const ip = await getClientIP(ctx)
    const result = await LoginLog.create({
        uid: ctx.session.uid,
        password: 'Yes',
        ip: ip
    })
    return result
}

const registerCheck = async (ctx) => {
    let data = ctx.request.body
    if (data.password !== data.repassword) {
        return new ErrorModel('两次密码不一致！')
    }
    if (!/^[A-Za-z0-9_]+$/.test(data.username)) {
        return new ErrorModel('用户名规则不正确！')
    }
    if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(data.nickname)) {
        return new ErrorModel('昵称规则不正确！')
    }
    if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(data.email)) {
        return new ErrorModel('邮箱地址规则不正确！')
    }
    if (!/0?(13|14|15|18)[0-9]{9}/.test(data.phone)) {
        return new ErrorModel('手机号码格式不正确！')
    }
    data.repassword = undefined
    data.ip = await getClientIP(ctx)
    data.password = getGernericPssword(data.password)
    data.token = getGernericPssword((new Date()).toLocaleString())
    const user = await User.findOne({
        where: {
            defunct: ['N', 'Y'],
            [Sequelize.Op.or]: [
                { username: data.username },
                { phone: data.phone },
                { nickname: data.nickname },
                { email: data.email },
            ]
        },
        attributes: ['username', 'phone', 'nickname', 'email']
    })
    if (user) {
        if (user.email.length) {
            return new ErrorModel('邮箱已注册！')
        }
        if (user.phone.length) {
            return new ErrorModel('手机号码已注册！')
        }
        if (user.username.length) {
            return new ErrorModel('用户名已存在！')
        }
        if (user.nickname.length) {
            return new ErrorModel('昵称已存在！')
        }
    }
    const result = await User.create(data)
    if (result) {
        result.password = undefined
        result.defunct = undefined
        result.token = undefined
        ctx.session.uid = result.uid
        ctx.cookies.set('uid', result.token, {
            maxAge: 1000 * 24 * 60 * 60 * 7,
            path: '/'
        })
        return new SuccessModel(result)
    }
    return new ErrorModel('注册失败！')

}

const updateUserInfo = async (ctx) => {
    let data = ctx.request.body
    const user = await User.findAll({
        where: {
            defunct: ['N', 'Y'],
            [Sequelize.Op.or]: [
                { phone: data.phone },
                { nickname: data.nickname },
                { email: data.email },
            ]
        },
        attributes: ['username', 'phone', 'nickname', 'email']
    })
    if (user.length > 1) {
        if (user.email.length) {
            return new ErrorModel('邮箱已注册！')
        }
        if (user.phone.length) {
            return new ErrorModel('手机号码已注册！')
        }
        if (user.nickname.length) {
            return new ErrorModel('昵称已存在！')
        }
    }
    if (data.password && data.password.length) {
        data.password = getGernericPssword(data.password)
        data.token = getGernericPssword((new Date()).toLocaleString())
        data.repassword = undefined
    }
    data.username = undefined
    const result = User.update(data, {
        where: {
            uid: ctx.session.uid
        }
    })
    if (result) {
        return new SuccessModel(result)
    }
    return new ErrorModel('更新失败！')
}

const loginCheck = async (ctx) => {
    const post = ctx.request.body
    const username = post.username
    const result = await User.findOne({
        where: {
            [Sequelize.Op.or]: [
                {
                    email: `${username}`
                },
                {
                    phone: `${username}`
                },
                {
                    username: `${username}`
                }
            ]
        },
        attributes: ['uid', 'username', 'password', 'nickname', 'email', 'phone', 'submit', 'accepted', 'school', 'createdAt', 'updatedAt']
    })
    if (result) {
        const checkStatus = checkGernericPassword(post.password, result.password)
        if (checkStatus) {
            result.password = undefined
            ctx.session.uid = result.uid
            let token = getGernericPssword((new Date).toLocaleString())
            await User.update({
                token: token
            }, {
                where: {
                    uid: result.uid
                }
            })
            ctx.cookies.set('uid', token, {
                maxAge: 1000 * 24 * 60 * 60 * 7,
                path: '/'
            })
            await setUserLoginLog(ctx)
            return new SuccessModel(result)
        } else {
            return new ErrorModel('用户名不存在或密码错误！')
        }
    } else {
        return new ErrorModel('用户名不存在或密码错误！')
    }
}

const getUserInfo = async (ctx) => {
    const cookies_uid = ctx.cookies.get('uid')
    const session_uid = ctx.session.uid
    if (session_uid) {
        const result = await User.findOne({
            where: {
                uid: session_uid
            },
            attributes: ['uid', 'username', 'nickname', 'email', 'phone', 'submit', 'accepted', 'school', 'createdAt', 'updatedAt']
        })
        ctx.cookies.set('uid', result.token, {
            maxAge: 1000 * 24 * 60 * 60 * 7,
            path: '/'
        })
        return new SuccessModel(result)
    }
    if (cookies_uid) {
        const result = await User.findOne({
            where: {
                token: cookies_uid
            },
            attributes: ['uid', 'username', 'nickname', 'email', 'phone', 'submit', 'accepted', 'school', 'createdAt', 'updatedAt']
        })
        if (result) {
            ctx.session.uid = result.uid
            return new SuccessModel(result)
        }
        return new ErrorModel('请先登录！')
    }
    return new ErrorModel('请先登录！')
}

const getRankList = async (ctx) => {
    try {
        const query = ctx.request.query
        const page = parseInt(query.page)
        const limit = parseInt(query.limit)
        const key = query.key || null
        let filter = {}
        if (Auth(ctx, ['administrator'])) {
            filter.defunct = ['N', 'Y']
        } else {
            filter.defunct = ['N']
        }
        if (key) {
            filter[Sequelize.Op.or] = [
                {
                    uid: {
                        [Sequelize.Op.like]: `%${key}%`
                    }
                },
                {
                    nickname: {
                        [Sequelize.Op.like]: `%${key}%`
                    }
                },
            ]
        }
        const result = await User.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['accepted', 'DESC'], ['submit', 'ASC'], ['uid', 'ASC']],
            where: filter,
            attributes: ['uid', 'nickname', 'accepted', 'submit']
        })
        return new SuccessModel({ count: result.count, data: result.rows })
    }
    catch {
        return new ErrorModel('读取失败！')
    }
}

const logout = async (ctx) => {
    ctx.session.uid = undefined
    ctx.cookies.set('uid', null, {
        path: '/'
    })
    return new SuccessModel('注销成功！')
}

module.exports = {
    getUserList,
    getUserCount,
    toggleUserStatus,
    enableUser,
    disableUser,
    getUserLoginLog,
    loginCheck,
    getUserInfo,
    getRankList,
    logout,
    registerCheck,
    updateUserInfo
}