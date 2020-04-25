const Db = require('../utils/database')
const Config = Db.import('../models/config')
const {SuccessModel, ErrorModel} = require('../utils/DataModel')
const {
    Auth
} = require('../common/function')


const getConfig = async (ctx) => {
    const query = ctx.query
    const result = await Config.findOne({
        where: {
            key: query.key
        }
    })
    return new SuccessModel(result)
}

const setConfig = async (ctx) => {
    const post = ctx.request.body
    const privilege = JSON.parse(ctx.session.privilege) || []
    if (!Auth(ctx, 'administrator')) {
        return new ErrorModel('权限不足！')
    }
    const result = await Config.update({
        val: post.val
    },{
        where: {
            key: post.key
        }
    })
    return new SuccessModel(result)
}

module.exports = {
    getConfig,
    setConfig
}