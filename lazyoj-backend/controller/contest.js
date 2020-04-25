const Db = require('../utils/database')
const Sequelize = require('sequelize')

// Import Models
const Contest = Db.import('../models/contest')
const ContestProblem = Db.import('../models/contest_problem')
const Solution = Db.import('../models/solution')
const Problem = Db.import('../models/problem')
const User = Db.import('../models/user')

const { SuccessModel, ErrorModel } = require('../utils/DataModel')

const {
    Auth,
    getClientIP
} = require('../common/function')

const {
    insertSourceCode
} = require('./source')

const solutionController = require('./solution')

const getContestCount = async (ctx) => {
    let filter = {}
    if (Auth(ctx, ['administrator', 'contest_creator'])) {
        filter.defunct = ['N', 'Y']
    } else {
        filter.defunct = ['N']
    }
    const result = await Contest.count({
        where: filter
    })
    return new SuccessModel({ count: result })
}

const getContestList = async (ctx) => {
    const query = ctx.request.query
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const key = query.key || null

    let filter = {}
    let attributes = []

    if (Auth(ctx, ['administrator', 'contest_creator'])) {
        filter.defunct = ['N', 'Y']
        attributes = [['cid', 'id'], 'title', 'start_time', 'end_time', 'defunct', 'description', 'private', 'langmask', 'password', 'judgemode', 'createdAt', 'updatedAt']
    } else {
        filter.defunct = ['N']
        attributes = [['cid', 'id'], 'title', 'start_time', 'end_time', 'description', 'private', 'langmask', 'judgemode', 'createdAt', 'updatedAt']
    }
    
    if (key) {
        filter[Sequelize.Op.or] = [
            {
                cid: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
            {
                uid: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
            {
                title: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
            {
                description: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
        ]
    }

    Contest.hasOne(User, { foreignKey: 'uid', sourceKey: 'uid' })

    const result = await Contest.findAndCountAll({
        where: filter,
        offset: (page - 1) * limit,
        limit: limit,
        attributes: attributes,
        order: [['cid', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['nickname']
            }
        ]
    })
    return new SuccessModel({ count: result.count, data: result.rows })
}

const getContestDetail = async (ctx) => {
    const query = ctx.request.query
    const cid = parseInt(query.id)
    Contest.hasOne(User, { foreignKey: 'uid', sourceKey: 'uid' })
    let filter = {
        cid: cid
    }
    let attributes = []
    if (Auth(ctx, ['administrator', 'contest_creator'])) {
        filter.defunct = ['N', 'Y']
        attributes = ['cid', 'title', 'start_time', 'end_time', 'defunct', 'description', 'private', 'langmask', 'password', 'judgemode', 'createdAt', 'updatedAt']
    } else {
        filter.defunct = ['N']
        attributes = ['cid', 'title', 'start_time', 'end_time', 'description', 'private', 'langmask', 'judgemode', 'createdAt', 'updatedAt']
    }
    const result = await Contest.findOne({
        where: filter,
        attributes: attributes,
        include: [
            {
                model: User,
                attributes: ['nickname']
            }
        ]
    })
    if (result) {
        return new SuccessModel(result)
    } else {
        return new ErrorModel('获取信息失败')
    }
}

const toggleContestStatus = async (ctx) => {
    const post = ctx.request.body
    const cid = escape(post.id)
    const defunct = escape(post.val)
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    const result = await Contest.update({
        defunct: defunct === "'N'" ? "N" : "Y"
    }, {
        where: {
            cid: cid
        }
    })
    if (result[0] > 0) {
        return new SuccessModel('修改成功！')
    } else {
        return new ErrorModel('修改失败！')
    }
}

const enableContest = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const cid = post.cid
        const result = await Contest.update({
            defunct: "N"
        }, {
            where: {
                cid: cid
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

const disableContest = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const cid = post.cid
        const result = await Contest.update({
            defunct: "Y"
        }, {
            where: {
                cid: cid
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

const updateContest = async (ctx) => {
    const post = ctx.request.body
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    const result = await Contest.update({
        title: post.title,
        start_time: post.start_time,
        end_time: post.end_time,
        description: post.description,
        defunct: post.defunct,
        private: post.private,
        langmask: post.langmask,
        judgemode: post.judgemode,
        password: post.password
    }, {
        where: {
            cid: parseInt(post.cid)
        }
    })
    if (result[0]) {
        return new SuccessModel({ pid: result.pid })
    } else {
        return new ErrorModel('更新问题失败！请联系管理员')
    }
}

const addContest = async (ctx) => {
    const post = ctx.request.body
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    const result = await Contest.create({
        title: post.title,
        uid: ctx.session.uid,
        start_time: post.start_time,
        end_time: post.end_time,
        description: post.description,
        defunct: post.defunct,
        private: post.private,
        langmask: post.langmask,
        judgemode: post.judgemode,
        password: post.password
    })
    if (result) {
        return new SuccessModel({ pid: result.pid })
    } else {
        return new ErrorModel('添加问题失败！请联系管理员')
    }
}

const getProblemList = async (ctx) => {
    const query = ctx.request.query
    const cid = parseInt(query.cid) || null

    if (!cid) {
        return new ErrorModel('参数错误！')
    }

    // 比赛未开始 禁止获取数据
    const contest = await Contest.findOne({
        where: {
            cid: cid
        }
    })
    if ((new Date()) < (new Date(contest.start_time))) {
        return new ErrorModel('竞赛尚未开始！')
    }
    ContestProblem.hasOne(Problem, { foreignKey: 'pid', sourceKey: 'pid' })
    const problemList = await ContestProblem.findAll({
        where: {
            cid: cid
        },
        order: [['num', 'ASC'], ['createdAt', 'DESC']],
        attributes: ['id', 'pid', 'num', 'c_accepted', 'c_submit', 'createdAt', 'updatedAt'],
        include: [
            {
                model: Problem,
                attributes: ['title'],
                required: false
            }
        ]
    })
    return new SuccessModel(problemList)

}

const deleteProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const result = ContestProblem.destroy({
            where: {
                pid: post.pid,
                cid: post.cid
            }
        })
        return new SuccessModel(result)
    }
    catch {
        return new ErrorModel('删除失败！')
    }
}

const addProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'contest_creator'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const pid = post.pid
        const base = parseInt(post.base) || 0
        let insertData = []
        for (let i in pid) {
            insertData.push({
                cid: post.cid,
                pid: parseInt(pid[i]),
                num: i + base
            })
        }
        const result = await ContestProblem.bulkCreate(insertData)
        return new SuccessModel({ count: result.count, data: result.rows })
    }
    catch {
        return new ErrorModel('删除失败！')
    }
}

const getProblemInfo = async (ctx) => {
    const query = ctx.request.query
    const num = parseInt(query.pid) || 0
    const cid = parseInt(query.cid) || 0
    ContestProblem.hasOne(Problem, { foreignKey: 'pid', sourceKey: 'pid' })
    ContestProblem.hasOne(Contest, { foreignKey: 'cid', sourceKey: 'cid' })
    const result = await ContestProblem.findOne({
        where: {
            cid: cid,
            num: num
        },
        include: [
            {
                model: Problem
            },
            {
                model: Contest
            }
        ]
    })
    return new SuccessModel(result)
}

const getSolutionList = async (ctx) => {
    const cid = parseInt(ctx.request.query.cid) || null
    const page = parseInt(ctx.request.query.page) || 1
    const limit = parseInt(ctx.request.query.limit) || 10
    const uid = parseInt(ctx.request.query.uid) || null
    const key = ctx.request.query.key || ""
    let userFilter = {}
    let filter = {}
    let attributes = []
    if (!cid) {
        return new ErrorModel('参数错误！')
    } else {
        filter.cid = cid
    }
    if (uid) {
        filter.uid = uid
    }
    if (key.length) {
        userFilter[Sequelize.Op.or] = [
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
    if (Auth(ctx, ['administrator', 'contest_creator'])) {
        attributes = ['sid', 'pid', 'uid', 'time', 'memory', 'result', 'language', 'cid', 'num', 'code_length', 'pass_rate', 'judger', 'language', 'createdAt', 'updatedAt']
    } else {
        attributes = ['sid', 'pid', 'uid', 'time', 'memory', 'result', 'language', 'cid', 'num', 'code_length', 'pass_rate', 'judger', 'language', 'createdAt', 'updatedAt']
    }
    Solution.hasOne(Problem, { foreignKey: 'pid', sourceKey: 'pid' })
    Solution.hasOne(User, { foreignKey: 'uid', sourceKey: 'uid' })
    const list = await Solution.findAndCountAll({
        where: filter,
        offset: (page - 1) * limit,
        limit: limit,
        attributes: attributes,
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
                required: false,
                where: userFilter
            }
        ]
    })
    return new SuccessModel({ count: list.count, data: list.rows })
}

const addSolution = async (ctx) => {
    return await solutionController.insertSolution(ctx)
}

const getSolutionStatus = async (ctx) => {
    return await solutionController.getSolutionStatus(ctx)
}

// 获取排名列表
const getRankList = async (ctx) => {
    const cid = ctx.query.cid || null
    let data = {}
    let ret = []
    let filter = {}
    if (!cid) {
        return new ErrorModel('参数错误！')
    }
    if (Auth(ctx, ['administrator', 'contest_creator'])) {
        filter.defunct = ['N', 'Y']
    } else {
        filter.defunct = ['N']
    }
    filter.cid = cid
    const contest = await Contest.findOne({
        where: filter
    })
    if (!contest) {
        return new ErrorModel('竞赛不存在')
    }
    const contest_problem = await ContestProblem.count({
        where: {
            cid: contest.cid
        }
    })
    Solution.hasOne(User, { foreignKey: 'uid', sourceKey: 'uid' })
    const solution = await Solution.findAll({
        where: {
            cid: contest.cid,
            createdAt: {
                [Sequelize.Op.between]: [(new Date(contest.start_time)), (new Date(contest.end_time))]
            }
        },
        include: [
            {
                model: User,
                attributes: ['nickname']
            }
        ],
        order: [['sid', 'ASC']]
    })
    for (let i in solution) {
        const item = solution[i]
        const index = item.num - 1
        if (!data[item.uid]) {
            data[item.uid] = {
                uid: item.uid,
                nickname: item.user.nickname,
                sloved: 0,
                penalty: 0,
                problem: []
            }

            for (let i = 1; i <= contest_problem; i++) {
                data[item.uid].problem.push({
                    ac: false,
                    wa: 0,
                    pass_rate: 0,
                    time: 0,
                    penalty: 0
                })
            }
        }
        if (contest.judgemode === 0) {
            if (!data[item.uid].problem[index].ac) {
                if (item.result === 4) {
                    data[item.uid].problem[index].ac = true
                    data[item.uid].problem[index].time = ((new Date(item.createdAt)) - (new Date(contest.start_time))) / 1000
                    data[item.uid].sloved += 1
                } else {
                    data[item.uid].problem[index].wa += 1
                    data[item.uid].problem[index].penalty += 20 * 60
                }
            }
        } else {
            if (!data[item.uid].problem[index].ac) {
                if (item.pass_rate >= data[item.uid].problem[index].pass_rate) {
                    if (item.pass_rate * 100 >= 100) {
                        data[item.uid].sloved += 1
                        data[item.uid].problem[index].ac = true
                    }
                    data[item.uid].problem[index].pass_rate = item.pass_rate
                    data[item.uid].problem[index].time = ((new Date(item.createdAt)) - (new Date(contest.start_time))) / 1000
                }
            }
        }
    }
    for (let i in data) {
        const item = data[i]
        let tmp = {
            uid: item.uid,
            nickname: item.nickname,
            sloved: 0,
            penalty: 0,
            mark: 0,
            problem: []
        }
        for (let j in item.problem) {
            let problem = item.problem[j]
            tmp.problem.push(problem)
            if (problem.ac) {
                tmp.sloved += 1
            }
            tmp.penalty += problem.time
            tmp.mark += parseInt(problem.pass_rate * 100)
        }
        ret.push(tmp)
    }
    ret.sort((a, b) => {
        if (contest.judgemode === 0) {
            if (a.sloved != b.sloved) {
                return b.sloved - a.sloved
            }
            else if (a.penalty != b.penalty) {
                return b.penalty - a.penalty
            } else {
                return b.uid - a.uid
            }
        } else {
            if (a.mark != b.mark) {
                return b.mark - a.mark
            }
            else if (a.penalty != b.penalty) {
                return b.penalty - a.penalty
            } else {
                return b.uid - a.uid
            }
        }
    })

    return new SuccessModel(ret)
}

module.exports = {
    getContestCount,
    getContestList,
    getContestDetail,
    toggleContestStatus,
    enableContest,
    disableContest,
    updateContest,
    addContest,
    getProblemList,
    deleteProblem,
    addProblem,
    getProblemInfo,
    getSolutionList,
    getSolutionStatus,
    getRankList,
    addSolution
}