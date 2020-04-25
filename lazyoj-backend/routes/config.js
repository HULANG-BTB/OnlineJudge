const router = require('koa-router')()

const {
    getConfig,
    setConfig
} = require('../controller/config')

router.prefix('/config')

router.get('/get', async (ctx, next) => {
  const result = await getConfig(ctx)
  ctx.body = result
})

router.post('/set', async (ctx, next) => {
    const result = await setConfig(ctx)
    ctx.body = result
  })

module.exports = router
