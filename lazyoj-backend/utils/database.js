const Sequelize = require('sequelize')
const mysqlConf = require('../config/mysql')

const Db = new Sequelize(
    mysqlConf.database,
    mysqlConf.username,
    mysqlConf.password,
    {
        host: mysqlConf.host,
        port: mysqlConf.port,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            idle: 30000
        },
    }
)
module.exports = Db