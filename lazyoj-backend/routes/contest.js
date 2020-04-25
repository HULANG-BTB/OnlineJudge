const router = require('koa-router')()

const {
  getContestCount,
  getContestList,
  getContestDetail,
  toggleContestStatus,
  enableContest,
  disableContest,
  updateContest,
  addContest,
  getProblemList,
  deleteProblem,
  addProblem,
  getProblemInfo,
  getSolutionList,
  getSolutionStatus,
  getRankList,
  addSolution
} = require('../controller/contest')

router.prefix('/contest')

router.get('/count', async (ctx, next) => {
  const result = await getContestCount(ctx)
  ctx.body = result
})

router.get('/list', async (ctx, next) => {
  const result = await getContestList(ctx)
  ctx.body = result
})

router.post('/toggleContestStatus', async (ctx, next) => {
  const result = await toggleContestStatus(ctx)
  ctx.body = result
})

router.post('/enable', async (ctx, next) => {
  const result = await enableContest(ctx)
  ctx.body = result
})

router.post('/disable', async (ctx, next) => {
  const result = await disableContest(ctx)
  ctx.body = result
})

router.get('/detail', async (ctx, next) => {
  const result = await getContestDetail(ctx)
  ctx.body = result
})

router.post('/update', async (ctx, next) => {
  const result = await updateContest(ctx)
  ctx.body = result
})

router.post('/add', async (ctx, next) => {
  const result = await addContest(ctx)
  ctx.body = result
})

router.get('/problemList', async (ctx, next) => {
  const result = await getProblemList(ctx)
  ctx.body = result
})

router.get('/problemInfo', async (ctx, next) => {
  const result = await getProblemInfo(ctx)
  ctx.body = result
})

router.get('/solution', async (ctx, next) => {
  const result = await getSolutionList(ctx)
  ctx.body = result
})

router.post('/deleteProblem', async (ctx, next) => {
  const result = await deleteProblem(ctx)
  ctx.body = result
})

router.post('/addProblem', async (ctx, next) => {
  const result = await addProblem(ctx)
  ctx.body = result
})

router.post('/submit', async (ctx, next) => {
  const result = await addSolution(ctx)
  ctx.body = result
})

router.get('/rank', async (ctx, next) => {
  const result = await getRankList(ctx)
  ctx.body = result
})

router.get('/status', async (ctx, next) => {
  const result = await getSolutionStatus(ctx)
  ctx.body = result
})

module.exports = router
