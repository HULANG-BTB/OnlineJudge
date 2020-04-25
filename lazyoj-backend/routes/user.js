const router = require('koa-router')()

const {
  getUserCount,
  getUserList,
  toggleUserStatus,
  enableUser,
  disableUser,
  getUserLoginLog,
  loginCheck,
  getUserInfo,
  getRankList,
  logout,
  registerCheck,
  updateUserInfo
} = require('../controller/user')

router.prefix('/user')

router.get('/user', async (ctx, next) => {
  ctx.session.uid = 1000 
  ctx.body = 1
})

router.get('/list', async (ctx, next) => {
  const result = await getUserList(ctx)
  ctx.body = result
})

router.get('/count', async (ctx, next) => {
  const result = await getUserCount(ctx)
  ctx.body = result
})

router.post('/toggleUserStatus', async (ctx, next) => {
  const result = await toggleUserStatus(ctx)
  ctx.body = result
})

router.post('/enableUser', async (ctx, next) => {
  const result = await enableUser(ctx)
  ctx.body = result
})

router.post('/disableUser', async (ctx, next) => {
  const result = await disableUser(ctx)
  ctx.body = result
})

router.get('/log', async (ctx, next) => {
  const result = await getUserLoginLog(ctx)
  ctx.body = result
})

router.post('/login', async (ctx, next) => {
  const result = await loginCheck(ctx)
  ctx.body = result
})

router.get('/info', async (ctx, next) => {
  const result = await getUserInfo(ctx)
  ctx.body = result
})

router.get('/rank', async (ctx, next) => {
  const result = await getRankList(ctx)
  ctx.body = result
})

router.get('/logout', async (ctx, next) => {
  const result = await logout(ctx)
  ctx.body = result
})

router.post('/register', async (ctx, next) => {
  const result = await registerCheck(ctx)
  ctx.body = result
})

router.post('/update', async (ctx, next) => {
  const result = await updateUserInfo(ctx)
  ctx.body = result
})

module.exports = router
