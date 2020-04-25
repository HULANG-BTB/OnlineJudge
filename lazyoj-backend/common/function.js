const Md5 = require('js-md5')
const Sha1 = require('js-sha1')
const Base64 = require('js-base64')
const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

// 格式化时间日期函数
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// MD5 加密
const md5 = (val) => {
    return Md5(val)
}

// 生成密码
const getGernericPssword = (password, salt) => {
    if (!salt) {
        salt = Sha1(Math.random())
        salt = salt.substr(0, 4)
    }
    let hash = Base64.Base64.encode(`${Sha1.hex(password + salt)}${salt}`)
    return hash + salt
}

// 检查密码是否匹配
const checkGernericPassword = (originPass, distPass) => {
    const salt = distPass.substr(-4)
    const password = getGernericPssword(originPass, salt)
    return password === distPass
}

// 获取当前日期
const getCurrentDate = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return { year, month, day }
}

// 格式化文件大小
const formatFileSize = (filesize) => {
    if (null == filesize || filesize == '') {
        return "0 Bytes";
    }
    let unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    let index = 0;
    let srcsize = parseFloat(filesize);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    let size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2);
    return size + unitArr[index];
}

// 获取过去七天的日期
const getLastSevenDate = () => {
    let rst = []
    let date = new Date();
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    rst.push(`${date.format("yyyy-MM-dd")} 23:59:59`)
    return rst
}

// 获取文件列表
const getFileList = (dest) => {
    return new Promise((resolve, reject) => {
        try {
            const list = fs.readdirSync(dest)
            let result = []
            for (let i in list) {
                let stats = fs.statSync(path.resolve(dest, list[i]))
                result.push({ filename: list[i], size: formatFileSize(stats.size) })
            }
            resolve(result)
        }
        catch (err) {
            resolve([])
        }
    })
}

// 移动上传文件
const moveFile = (source, dest) => {
    const reader = fs.createReadStream(source);
    if (!isFileExists(path.dirname(dest))) {
        makeDir(path.dirname(dest))
    }
    const writer = fs.createWriteStream(dest);
    reader.pipe(writer);
}

// 文件是否存在
const isFileExists = (dest) => {
    const result = fs.existsSync(dest)
    return result
}

// 创建文件夹
const makeDir = (dest, mode) => {
    if (!mode) mode = 0777;
    // 父目录不存在 递归创建
    if (!isFileExists(path.dirname(dest))) {
        makeDir(path.dirname(dest), mode)
    }
    // 当前目录不存在 创建
    if (!isFileExists(dest)) {
        console.log('crreate dir ', dest)
        return fs.mkdirSync(dest, mode)
    }
    return true
}

// 删除文件
const removeFile = (dest) => {
    if (isFileExists(dest)) {
        if (fs.statSync(dest).isDirectory()) {
            const files = fs.readdirSync(dest);
            files.forEach(file => {
                const child = path.resolve(dest, file)
                const stats = fs.statSync(child);
                if (stats.isDirectory()) {
                    removeFile(child)
                } else {
                    fs.unlinkSync(child)
                }
            })
            fs.rmdirSync(dest)
        } else {
            fs.unlinkSync(dest)
        }
        
    }
    return !isFileExists(dest)
}

// 获取文件
const getFile = (dest) => {
    if (isFileExists(dest)) {
        return fs.createReadStream(dest);
    }
    return null
}

// 获取文件内容
const getFileContent = (dest) => {
    if (isFileExists(dest)) {
        return fs.readFileSync(dest, 'utf-8');
    }
    return null
}

// 写入文件内容
const putFileContent = (dest, data, options) => {
    if (!options) {
        options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' };
    }
    if (!isFileExists(path.dirname(dest))) {
        makeDir(path.dirname(dest))
    }
    return fs.writeFileSync(dest, data, options)
}

// 获取客户端IP地址
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip']
};

// 权限验证
const Auth = (ctx, privilege) => {
    const privileges = JSON.parse(ctx.session.privilege || "[]") || []
    const result = privileges.find(e => {
        if (typeof privilege === 'string') {
            return e === privilege
        } else {
            return privilege.includes(e)
        }
    })
    return result
}

const xmlToJs = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const parser = new xml2js.Parser()
            parser.parseString(data, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        }
        catch (err) {
            reject(err)
        }

    })
}

const jsToXml = async (obj) => {
    const builder = new xml2js.Builder({
        cdata: true
    });
    var xml = builder.buildObject(obj);
    return xml
}

module.exports = {
    getGernericPssword,
    checkGernericPassword,
    getCurrentDate,
    getLastSevenDate,
    getFileList,
    moveFile,
    isFileExists,
    removeFile,
    getFile,
    getFileContent,
    putFileContent,
    md5,
    getClientIP,
    Auth,
    xmlToJs,
    jsToXml
}