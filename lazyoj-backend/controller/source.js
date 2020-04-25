const Db = require('../utils/database')
const SourceCode = Db.import('../models/source_code')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
    SuccessModel,
    ErrorModel
} = require('../utils/DataModel')
const {
    getLastSevenDate,
    getClientIP
} = require('../common/function')


const insertSourceCode = async (ctx, sid) => {
    const source = ctx.request.body.source
    const result = await SourceCode.create({
        sid: sid,
        source: source
    })
    return new SuccessModel(result)
}

module.exports = {
    insertSourceCode
}