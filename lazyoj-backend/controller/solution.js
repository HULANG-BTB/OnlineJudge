const Db = require('../utils/database')
const Solution = Db.import('../models/solution')
const Problem = Db.import('../models/problem')
const Contest = Db.import('../models/contest')
const User = Db.import('../models/user')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {
    SuccessModel,
    ErrorModel
} = require('../utils/DataModel')

const {
    getLastSevenDate,
    getClientIP,
    Auth
} = require('../common/function')

const {
    insertSourceCode
} = require('./source')

// 获取提交总数
const getSolutionCount = async (ctx) => {
    let where = {}
    let uid = ctx.request.query.uid
    if (uid === "0") {
        where.uid = ctx.session.uid
    }
    else if (uid) {
        where.uid = uid
    }
    const result = await Solution.count({
        where: where
    })
    return new SuccessModel({ count: result })
}

// 获取正确总数
const getAcceptedCount = async (ctx) => {
    let where = {
        result: 4
    }
    let uid = ctx.request.query.uid
    if (uid === "0") {
        where.uid = ctx.session.uid
    }
    else if (uid) {
        where.uid = uid
    }
    const result = await Solution.count({
        where: where
    })
    return new SuccessModel({ count: result })
}

// 获取用户题目次数
const getProblemCount = async (ctx) => {
    let where = {}
    let uid = ctx.request.query.uid
    if (uid === "0") {
        where.uid = ctx.session.uid
    }
    else if (uid) {
        where.uid = uid
    }
    const result = await Solution.count({
        where: where,
        group: 'pid',
        attributes: ['pid']
    })
    return new SuccessModel({ count: result.length})
}

// 获取用户竞赛次数
const getContestCount = async (ctx) => {
    let where = {
        cid: {
            [Sequelize.Op.ne]: null
        }
    }
    let uid = ctx.request.query.uid
    if (uid === "0") {
        where.uid = ctx.session.uid
    }
    else if (uid) {
        where.uid = uid
    }
    const result = await Solution.findAll({
        where: where,
        group: 'cid',
        attributes: ['cid']
    })
    return new SuccessModel({ count: result.length })
}

// 获取最近7天统计数据
const getStatisticsInfo = async (ctx) => {
    let uid = ctx.request.query.uid
    let arr = {}
    let result = {}
    let dateList = getLastSevenDate()
    dateList = dateList.reverse()
    for (let i = 0; i < dateList.length - 1; i++) {
        let where = {
            createdAt: {
                [Op.between]: [dateList[i], dateList[i + 1]]
            }
        }
        if (uid === "0") {
            where.uid = ctx.session.uid
        }
        else if (uid) {
            where.uid = uid
        }
        let rst = await Solution.count({
            where: where
        })
        let date = dateList[i + 1].substr(0, dateList[i + 1].indexOf(' '))
        arr[date] = rst
    }
    result['total'] = arr
    arr = {}
    for (let i = 0; i < dateList.length - 1; i++) {
        let where = {
            createdAt: {
                [Op.between]: [dateList[i], dateList[i + 1]]
            },
            result: {
                [Op.eq]: 4
            }
        }
        if (uid === "0") {
            where.uid = ctx.session.uid
        }
        else if (uid) {
            where.uid = uid
        }
        let rst = await Solution.count({
            where: where
        })
        let date = dateList[i + 1].substr(0, dateList[i + 1].indexOf(' '))
        arr[date] = rst
    }
    result['accept'] = arr
    return new SuccessModel(result)
}

const insertSolution = async (ctx) => {
    const post = ctx.request.body
    const ip = getClientIP(ctx.request)
    const uid = ctx.session.uid
    const language = post.language
    const pid = post.pid
    const cid = post.cid
    const num = post.num || -1
    let data = {
        pid: pid,
        uid: uid,
        language: language,
        ip: ip,
        code_length: post.source.length >= 0 ? post.source.length : 0,
        num: num
    }
    if (!uid) {
        return new ErrorModel('请先登录！')
    }
    if (cid) {
        data.cid = cid
        const contest = await Contest.findOne({
            where: {
                cid: cid
            }
        })
        if (contest) {
            const date = new Date()
            const start = new Date(contest.start_time)
            const end = new Date(contest.end_time)
            if ((date < start || date > end) && !Auth(ctx, ['administrator', 'contest_creator'])) {
                return new ErrorModel('不在竞赛时间内不允许提交！')
            }
        } else {
            return new ErrorModel('参数错误！')
        }
    }
    const solution = await Solution.create(data)
    if (solution) {
        const sourceCode = await insertSourceCode(ctx, solution.sid)
        if (sourceCode) {
            return new SuccessModel(sourceCode)
        } else {
            return new ErrorModel('提交失败！')
        }
    } else {
        return new ErrorModel('提交失败！')
    }
}

const getSolutionStatus = async (ctx) => {
    const sid = ctx.request.query.sid || 0
    const result = await Solution.findOne({
        where: {
            sid: sid
        },
        attributes: ['sid', 'pid', 'uid', 'time', 'memory', 'result', 'code_length']
    })
    if (result) {
        return new SuccessModel(result)
    }
    return new ErrorModel('获取失败！')
}

const getSolutionList = async (ctx) => {
    const query = ctx.request.query
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const cid = query.cid || null
    const key = query.key || null
    let filter = {
        cid: cid
    }
    const uid = parseInt(query.uid) || 0
    if (uid) {
        filter.uid = uid
    }
    if (key) {
        filter[Sequelize.Op.or] = [
            {
                sid: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
            {
                uid: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
            {
                pid: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
        ]
    }
    let fileds = ['sid', 'pid', 'uid', 'num', 'result', 'memory', 'time', 'code_length', 'language', 'createdAt', 'updatedAt']
    // 判断是否为管理员
    Solution.hasOne(Problem, { foreignKey: 'pid', sourceKey: 'pid' })
    Solution.hasOne(User, { foreignKey: 'uid', sourceKey: 'uid' })
    const result = await Solution.findAndCountAll({
        where: filter,
        offset: (page - 1) * limit,
        limit: limit,
        attributes: fileds,
        order: [['sid', 'DESC']],
        include: [
            {
                model: Problem,
                attributes: ['title'],
                required: false
            },
            {
                model: User,
                attributes: ['nickname'],
                required: false
            }
        ]
    })
    return new SuccessModel({ count: result.count, data: result.rows })
}

const getAcceptedList = async (ctx) => {
    let where = {
        result: 4
    }
    let uid = ctx.request.query.uid
    if (uid === "0") {
        where.uid = ctx.session.uid
    }
    else if (uid) {
        where.uid = uid
    }
    Solution.hasOne(Problem, {foreignKey: 'pid', sourceKey: 'pid'})
    const result = await Solution.findAll({
        where: where,
        group: 'pid',
        attributes: ['pid'],
        include: [
            {
                model: Problem,
                attributes: ['title']
            }
        ]
    })
    return new SuccessModel(result)
}

module.exports = {
    getSolutionCount,
    getStatisticsInfo,
    insertSolution,
    getSolutionStatus,
    getSolutionList,
    getAcceptedCount,
    getProblemCount,
    getContestCount,
    getAcceptedList
}