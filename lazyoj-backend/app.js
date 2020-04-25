const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redis = require('koa-redis')
const redisConfig = require('./config/redis')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const contestRouter = require('./routes/contest')
const problemRouter = require('./routes/problem')
const solutionRouter = require('./routes/solution')
const resourcesRouter = require('./routes/resources')
const newsRouter = require('./routes/news')
const configRouter = require('./routes/config')
const privilegeRouter = require('./routes/privilege')

const koaBody = require('koa-body')

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/static'))

// parseBody File
app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//session 配置
app.keys = ['zx#ad']
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: redis({
    all: `${redisConfig.host}:${redisConfig.port}`
  })
}))

// routes
app.use(indexRouter.routes(), indexRouter.allowedMethods())
app.use(userRouter.routes(), userRouter.allowedMethods())
app.use(contestRouter.routes(), contestRouter.allowedMethods())
app.use(problemRouter.routes(), problemRouter.allowedMethods())
app.use(solutionRouter.routes(), solutionRouter.allowedMethods())
app.use(resourcesRouter.routes(), resourcesRouter.allowedMethods())
app.use(newsRouter.routes(), newsRouter.allowedMethods())
app.use(configRouter.routes(), configRouter.allowedMethods())
app.use(privilegeRouter.routes(), privilegeRouter.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
