const router = require('koa-router')()

const {
  getSolutionCount,
  getAcceptedCount,
  getProblemCount,
  getContestCount,
  getStatisticsInfo,
  insertSolution,
  getSolutionStatus,
  getSolutionList,
  getAcceptedList
} = require('../controller/solution')

router.prefix('/solution')

router.get('/count', async (ctx, next) => {
  const result = await getSolutionCount(ctx)
  ctx.body = result
})

router.get('/acceptedCount', async (ctx, next) => {
  const result = await getAcceptedCount(ctx)
  ctx.body = result
})

router.get('/problemCount', async (ctx, next) => {
  const result = await getProblemCount(ctx)
  ctx.body = result
})

router.get('/contestCount', async (ctx, next) => {
  const result = await getContestCount(ctx)
  ctx.body = result
})

router.get('/statistics', async (ctx, next) => {
  const result = await getStatisticsInfo(ctx)
  ctx.body = result
})

router.post('/submit', async (ctx, next) => {
  const result = await insertSolution(ctx)
  ctx.body = result
})

router.get('/status', async (ctx, next) => {
  const result = await getSolutionStatus(ctx)
  ctx.body = result
})

router.get('/list', async (ctx, next) => {
  const result = await getSolutionList(ctx)
  ctx.body = result
})

router.get('/acceptedList', async (ctx, next) => {
  const result = await getAcceptedList(ctx)
  ctx.body = result
})

module.exports = router
