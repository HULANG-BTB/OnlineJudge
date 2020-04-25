const Db = require('../utils/database')
const Problem = Db.import('../models/problem')
const { SuccessModel, ErrorModel } = require('../utils/DataModel')
const escape = require('mysql2').escape
const path = require('path')
const {
    getFileList,
    moveFile,
    isFileExists,
    removeFile,
    getFile,
    md5
} = require('../common/function')

const getDataFileList = async (ctx) => {
    const query = ctx.request.query
    const pid = parseInt(query.id)
    const dest = path.resolve(__dirname, '../../data', `${pid}`)
    const result = await getFileList(dest)
    return new SuccessModel(result)
}

const uploadDataFile = async (ctx) => {
    const files = ctx.request.files
    const pid = parseInt(ctx.request.body.pid)
    let result = {
        success: [],
        error: []
    }
    for (let i in files) {
        let dest = path.resolve(__dirname, '../../data/', `${pid}`, files[i].name)
        moveFile(files[i].path, dest)
        if (isFileExists(dest)) {
            result.success.push(files[i].name)
        } else {
            result.error.push(files[i].name)
        }
    }
    return new SuccessModel(result)
}

const deleteDataFile = async (ctx) => {
    const pid = parseInt(ctx.request.body.pid)
    const filename = ctx.request.body.filename
    const dest = path.resolve(__dirname, '../../data/', `${pid}`, filename)
    const result = removeFile(dest)
    if (result) {
        return new SuccessModel('删除成功！')
    } else {
        return new ErrorModel('删除失败！')
    }
}

const downloadDataFile = async (ctx) => {
    const pid = parseInt(ctx.request.query.pid)
    const filename = ctx.request.query.filename
    ctx.set('Content-disposition','attachment;filename='+filename);
    const dest = path.resolve(__dirname, '../../data/', `${pid}`, filename)
    return getFile(dest)
}

const uploadImage = async (ctx) => {
    const files = ctx.request.files
    let result = {
        success: [],
        error: []
    }
    for (let i in files) {
        let date = new Date()
        let extname = path.extname(files[i].name)
        let dest = path.resolve(__dirname, '../uploads/images', date.format("yyyy-MM-dd") , `${md5(files[i].name)}.${extname}`)
        moveFile(files[i].path, dest)
        if (isFileExists(dest)) {
            result.success.push({
                file: files[i].name,
                url: `/uploads/images/${date.format("yyyy-MM-dd")}/${path.basename(dest)}`
            })
        } else {
            result.error.push({
                file: files[i].name,
                url: ''
            })
        }
    }
    return new SuccessModel(result)
}

const readImage = async (ctx) => {
    const url = ctx.request.query.url || ''
    const dest = path.resolve(__dirname, '../', `./${url}`)
    const extname = path.extname(dest)
    ctx.set('Content-Type',`image/${extname.substr(1)}`);
    return getFile(dest)
}

module.exports = {
    uploadImage,
    readImage,
    getDataFileList,
    uploadDataFile,
    deleteDataFile,
    downloadDataFile
}