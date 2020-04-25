const router = require('koa-router')()

const {
    getPrivilegeInfo,
    getPrivilegeList,
    deletePrivilege,
    addPrivilege
} = require('../controller/privilege')

router.prefix('/privilege')

router.get('/get', async (ctx, next) => {
  const result = await getPrivilegeInfo(ctx)
  ctx.body = result
})

router.get('/list', async (ctx, next) => {
  const result = await getPrivilegeList(ctx)
  ctx.body = result
})

router.post('/delete', async (ctx, next) => {
  const result = await deletePrivilege(ctx)
  ctx.body = result
})

router.post('/add', async (ctx, next) => {
  const result = await addPrivilege(ctx)
  ctx.body = result
})

module.exports = router
