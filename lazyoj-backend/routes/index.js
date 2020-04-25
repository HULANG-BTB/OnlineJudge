const router = require('koa-router')()
const User = require('../controller/user')
const Func = require('../common/function')


router.get('/', async (ctx, next) => {
  const rst = Func.getGernericPssword(123)
  ctx.body = rst
})

router.get('/string', async (ctx, next) => {
  console.log(ctx)
  ctx.body = 'koa2 string'
})

router.get('/session', async (ctx, next) => {
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0
  }
  ctx.session.viewCount++;
  ctx.body = {
    error: 0,
    view: ctx.session.viewCount
  }
})

module.exports = router
