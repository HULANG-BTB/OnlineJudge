class BaseModel {
    constructor(data, msg) {
        if (typeof data === 'string') {
            this.msg = data
            data = null
            msg = null
        }
        if (data) {
            this.data = data
        }
        if (msg) {
            this.msg = msg
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, msg, code = 1) {
        super(data, msg)
        this.code = code
    }
}

class ErrorModel extends BaseModel {
    constructor(data, msg, code = 0) {
        super(data, msg)
        this.code = code
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}