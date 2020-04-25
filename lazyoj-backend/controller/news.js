const Db = require('../utils/database')
const News = Db.import('../models/news')
const { SuccessModel, ErrorModel } = require('../utils/DataModel')
const escape = require('mysql2').escape
const {
    Auth
} = require('../common/function')


const getNewsList = async (ctx) => {
    const query = ctx.request.query
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    let filter = {}
    let attributes = []
    if (Auth(ctx, 'administrator') && query.admin) {
        filter.defunct = ['N','Y']
        attributes = ['nid', 'uid', 'title', 'content', 'defunct', 'createdAt', 'updatedAt']
    } else {
        filter.defunct = ['N']
        attributes = ['nid', 'uid', 'title', 'content', 'createdAt', 'updatedAt']
    }
    const result = await News.findAndCountAll({
        where: filter,
        offset: (page - 1) * limit,
        limit: limit,
        attributes: attributes,
        order: [['nid', 'DESC']]
    })
    return new SuccessModel({ count: result.count, data: result.rows })
}


const toggleNewsStatus = async (ctx) => {
    const post = ctx.request.body
    const nid = escape(post.nid)
    const defunct = escape(post.val)
    if (!Auth(ctx, 'administrator') || !post.admin) {
        return new ErrorModel('权限不足！')
    }
    const result = await News.update({
        defunct: defunct === "'N'" ? "N" : "Y"
    }, {
        where: {
            nid: nid
        }
    })
    if (result[0]) {
        return new SuccessModel('修改成功！')
    } else {
        return new ErrorModel('修改失败！')
    }
}

const updateNews = async (ctx) => {
    const post = ctx.request.body
    if (!Auth(ctx, 'administrator') || !post.admin) {
        return new ErrorModel('权限不足！')
    }
    const result = await News.update({
        title: post.title,
        content: post.content,
    }, {
        where: {
            nid: parseInt(post.nid)
        }
    })
    if (result[0]) {
        return new SuccessModel({ pid: result.pid })
    } else {
        return new ErrorModel('更新问题失败！请联系管理员')
    }
}

const deleteNews = async (ctx) => {
    const post = ctx.request.body
    const nid = parseInt(post.nid)
    if (!Auth(ctx, 'administrator') || !post.admin) {
        return new ErrorModel('权限不足！')
    }
    const result = await News.destroy({
        where: {
            nid: nid
        }
    })
    if (result !== 0) {
        return new SuccessModel('删除成功！')
    } else {
        return new ErrorModel('删除失败！')
    }
}

const addNews = async (ctx) => {
    const post = ctx.request.body
    try {
        const result = await News.create({
            uid: parseInt(ctx.session.uid),
            title: post.title,
            content: post.content,
        })
        if (result) {
            return new SuccessModel({ nid: result.nid })
        } else {
            return new ErrorModel('更新问题失败！请联系管理员')
        }
    }
    catch {
        return new ErrorModel('更新问题失败！请联系管理员')
    }
}

module.exports = {
    getNewsList,
    toggleNewsStatus,
    updateNews,
    deleteNews,
    addNews
}