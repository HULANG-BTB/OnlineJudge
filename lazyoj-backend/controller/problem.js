const Db = require('../utils/database')
const Problem = Db.import('../models/problem')
const Solution = Db.import('../models/solution')
const { SuccessModel, ErrorModel } = require('../utils/DataModel')
const Sequelize = require('sequelize')
const escape = require('mysql2').escape
const path = require('path')

const {
    Auth,
    xmlToJs,
    jsToXml,
    getFileContent,
    putFileContent,
    getFileList,
    removeFile
} = require('../common/function')


const language_ext = [
    "c",
    "cc",
    "pas",
    "java",
    "rb",
    "sh",
    "py",
    "php",
    "pl",
    "cs",
    "m",
    "bas",
    "scm",
    "c",
    "cc",
    "lua",
    "js",
    "go",
    "sql",
    "f95",
    "m"
]

const language_name = [
    "C",
    "C++",
    "Pascal",
    "Java",
    "Ruby",
    "Bash",
    "Python",
    "PHP",
    "Perl",
    "C#",
    "Obj-C",
    "FreeBasic",
    "Scheme",
    "Clang",
    "Clang++",
    "Lua",
    "JavaScript",
    "Go",
    "SQL(sqlite3)",
    "Fortran",
    "Matlab(Octave)",
    "OtherLanguage"
]

const getProblemCount = async (ctx) => {
    let filter = {}
    if (Auth(ctx, ['administrator', 'problem_editor'])) {
        filter.defunct = ['N', 'Y']
    } else {
        filter.defunct = ['N']
    }
    const result = await Problem.count({
        where: filter
    })
    return new SuccessModel({ count: result })
}

const getProblemList = async (ctx) => {
    const query = ctx.request.query
    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const key = query.key || null
    let filter = {}
    let fileds = []
    // 权限判定
    if (Auth(ctx, ['administrator', 'problem_editor'])) {
        filter.defunct = ['N', 'Y']
        fileds = [['pid', 'id'], 'title', 'source', 'defunct', 'accepted', 'submit', 'createdAt', 'updatedAt']
    } else {
        filter.defunct = ['N']
        fileds = [['pid', 'id'], 'title', 'accepted', 'submit']
    }
    if (key) {
        filter[Sequelize.Op.or] = [
            {
                pid: {
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
            {
                source: {
                    [Sequelize.Op.like]: `%${key}%`
                }
            },
        ]
    }
    const result = await Problem.findAndCountAll({
        where: filter,
        offset: (page - 1) * limit,
        limit: limit,
        attributes: fileds,
        order: [['pid', 'ASC']]
    })
    return new SuccessModel({ count: result.count, data: result.rows })
}

const toggleProblemStatus = async (ctx) => {
    const post = ctx.request.body
    const pid = escape(post.id)
    const defunct = escape(post.val)
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const result = await Problem.update({
        defunct: defunct === "'N'" ? "N" : "Y"
    }, {
        where: {
            pid: pid
        }
    })
    if (result[0] > 0) {
        return new SuccessModel('修改成功！')
    } else {
        return new ErrorModel('修改失败！')
    }
}

const enableProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const pid = post.pid
        const result = await Problem.update({
            defunct: "N"
        }, {
            where: {
                pid: pid
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

const disableProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足！')
    }
    try {
        const post = ctx.request.body
        const pid = post.pid
        const result = await Problem.update({
            defunct: "Y"
        }, {
            where: {
                pid: pid
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

const deleteProblem = async (ctx) => {
    const post = ctx.request.body
    const pid = parseInt(post.id)
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const result = await Problem.destroy({
        where: {
            pid: pid
        }
    })
    if (result !== 0) {
        const dest = path.resolve(__dirname, '../../data/', `${pid}`)
        removeFile(dest)
        return new SuccessModel('删除成功！')
    } else {
        return new ErrorModel('删除失败！')
    }
}

const addProblem = async (ctx) => {
    const post = ctx.request.body
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const result = await Problem.create({
        title: post.title,
        time_limit: parseFloat(post.time_limit),
        memory_limit: parseInt(post.memory_limit),
        description: post.description,
        input: post.input,
        output: post.output,
        sample_input: post.sampleInput,
        sample_output: post.sampleOutput,
        hint: post.hint,
        spj: post.spj,
    })
    if (result) {
        return new SuccessModel({ pid: result.pid })
    } else {
        return new ErrorModel('添加问题失败！请联系管理员')
    }
}

const getProblemDetail = async (ctx) => {
    const query = ctx.request.query
    const pid = parseInt(query.id) || 0
    const language = query.language || 1
    let result = await Problem.findOne({
        where: {
            pid: pid
        },
        attributes: ['pid', 'title', 'description', 'input', 'output', 'sample_input', 'sample_output', 'spj', 'hint', 'source', 'time_limit', 'memory_limit', 'accepted', 'submit', 'createdAt', 'updatedAt']
    })
    if (result) {
        let dest = path.resolve(__dirname, '../../data/', `${pid}`, 'template', `template.${language_ext[language - 1]}`)
        const source = getFileContent(dest)
        result.dataValues.template = source
        return new SuccessModel(result)
    } else {
        return new ErrorModel('获取信息失败')
    }
}

const updateProblem = async (ctx) => {
    const post = ctx.request.body
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const result = await Problem.update({
        title: post.title,
        time_limit: parseFloat(post.time_limit),
        memory_limit: parseInt(post.memory_limit),
        description: post.description,
        input: post.input,
        output: post.output,
        sample_input: post.sampleInput,
        sample_output: post.sampleOutput,
        hint: post.hint,
        spj: post.spj
    }, {
        where: {
            pid: parseInt(post.pid)
        }
    })
    if (result[0]) {
        return new SuccessModel({ pid: result.pid })
    } else {
        return new ErrorModel('更新问题失败！请联系管理员')
    }
}

const importProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const files = ctx.request.files
    const text = getFileContent(files.fps.path)
    const result = await xmlToJs(text)
    const list = result.fps.item
    let success = []
    for (let i in list) {
        let data = {
            title: list[i].title[0],
            description: list[i].description[0],
            input: list[i].input[0],
            output: list[i].output[0],
            sample_input: list[i].sample_input[0],
            sample_output: list[i].sample_output[0],
            hint: list[i].hint[0],
            source: list[i].source[0],
            time_limit: parseInt(list[i].time_limit[0]._) * (list[i].time_limit[0].$.unit === "s" ? 1000 : 1),
            memory_limit: parseInt(list[i].memory_limit[0]._),
        }
        const testInputData = list[i].test_input
        const testOutputData = list[i].test_output
        const template = list[i].template
        const problem = await Problem.create(data)
        if (problem) {
            success.push(problem)
            const pid = problem.pid
            for (let i in testInputData) {
                let dest = path.resolve(__dirname, '../../data/', `${pid}`, `test${i}.in`)
                putFileContent(dest, testInputData[i])
            }
            for (let i in testOutputData) {
                let dest = path.resolve(__dirname, '../../data/', `${pid}`, `test${i}.out`)
                putFileContent(dest, testInputData[i])
            }
            for (let i in template) {
                const code = template[i]._
                const language = template[i].$.language
                const ext = language_ext[language_name.indexOf(language)]
                let dest = path.resolve(__dirname, '../../data/', `${pid}`, 'template', `template.${ext}`)
                putFileContent(dest, code)
            }
        }
    }
    return new SuccessModel(success)
}

const exportProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const data = ctx.request.body
    let filter = {}
    if (data.type === 'in') {
        filter.pid = data.data
    } else {
        filter.pid = {
            [Sequelize.Op.between]: [data.data.begin, data.data.end]
        }
    }
    problems = await Problem.findAll({
        where: filter
    })
    let ret = {
        fps: {
            $:{
                version: "1.2",
                url: 'https://lazyoj.cn'
            },
            generator: {
                $: {
                    name: 'LazyOJ',
                    url: 'https://lazyoj.cn'
                }
            },
            item: []
        }
    }
    for (let i in problems) {
        const problem = problems[i]
        let item = {
            title: {
                _: problem.title
            },
            time_limit: {
                $: {
                    unit: 's'
                },
                _: `${parseInt(problem.time_limit) / 1000}`
            },
            memory_limit: {
                $: {
                    unit: 'mb'
                },
                _: `${parseInt(problem.memory_limit)}`
            },
            description: {
                _: problem.description || " "
            },
            input: {
                _: problem.input || " "
            },
            output: {
                _: problem.output || " "
            },
            sample_input: {
                _: problem.sample_input || " "
            },
            sample_output: {
                _: problem.sample_output || " "
            },
            hint: {
                _: problem.hint || " "
            },
            source: {
                _: problem.source || " "
            },
            solution: [],
            template: [],
            test_input: [],
            test_output: [],
            defunct: 'Y'
        }
        const testFilePath = path.resolve(__dirname, '../../data/', `${problem.pid}`)
        const testfileList = await getFileList(testFilePath)
        for (let i in testfileList) {
            const ext = path.extname(testfileList[i].filename)
            const base = path.basename(testfileList[i].filename).replace(ext, '')
            if (ext === ".in") {
                in_dest = path.resolve(__dirname, '../../data/', `${problem.pid}`, `${base}.in`)
                out_dest = path.resolve(__dirname, '../../data/', `${problem.pid}`, `${base}.out`)
                in_text = getFileContent(in_dest)
                out_text = getFileContent(out_dest)
                item.test_input.push({
                    _: in_text
                })
                item.test_output.push({
                    _: out_text
                })
            }
        }
        const templateFilePath = path.resolve(__dirname, '../../data/', `${problem.pid}`, 'template')
        const templatefileList = await getFileList(templateFilePath)
        for (let i in templatefileList) {
            const ext = path.extname(templatefileList[i].filename).replace('.', '')
            const language = language_name[language_ext.indexOf(ext)]
            code_dest = path.resolve(__dirname, '../../data/', `${problem.pid}`, 'template', `${templatefileList[i].filename}`)
            const code = getFileContent(code_dest)
            item.template.push({
                $: {
                    language: language
                },
                _: code
            })
        }
        ret.fps.item.push(item)
    }
    const result = await jsToXml(ret)
    return new SuccessModel({content: result})
}

const judgeProblem = async (ctx) => {
    if (!Auth(ctx, ['administrator', 'problem_editor'])) {
        return new ErrorModel('权限不足')
    }
    const post = ctx.request.body
    let filter = {}
    if (post.type === "problem") {
        filter.pid = post.problem
        filter.cid = null
    }
    else if (post.type === "solution") {
        filter.sid = post.solution
    }
    else if (post.type === "contest") {
        filter.cid = post.contest
    }
    else {
        filter.pid = {
            [Sequelize.Op.between]: [post.begin, post.end]
        }
    }
    const result = await Solution.update({
        result: 1
    }, {
        where: filter
    })
    if (result) {
        return new SuccessModel('提交成功！')
    } else {
        return new ErrorModel('提交失败！')
    }
}

module.exports = {
    getProblemCount,
    getProblemList,
    toggleProblemStatus,
    enableProblem,
    disableProblem,
    deleteProblem,
    addProblem,
    getProblemDetail,
    updateProblem,
    importProblem,
    exportProblem,
    judgeProblem
}