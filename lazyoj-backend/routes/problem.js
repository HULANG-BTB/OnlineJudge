const router = require('koa-router')()

const {
  getProblemCount,
  getProblemList,
  toggleProblemStatus,
  deleteProblem,
  addProblem,
  getProblemDetail,
  updateProblem,
  importProblem,
  exportProblem,
  enableProblem,
  disableProblem,
  judgeProblem
} = require('../controller/problem')

router.prefix('/problem')

router.get('/count', async (ctx, next) => {
  const result = await getProblemCount(ctx)
  ctx.body = result
})

router.get('/list', async (ctx, next) => {
    const result = await getProblemList(ctx)
    ctx.body = result
})

router.post('/toggleProblemStatus', async (ctx, next) => {
    const result = await toggleProblemStatus(ctx)
    ctx.body = result
})

router.post('/enable', async (ctx, next) => {
  const result = await enableProblem(ctx)
  ctx.body = result
})

router.post('/disable', async (ctx, next) => {
  const result = await disableProblem(ctx)
  ctx.body = result
})

router.post('/delete', async (ctx, next) => {
    const result = await deleteProblem(ctx)
    ctx.body = result
})

router.post('/add', async (ctx, next) => {
  const result = await addProblem(ctx)
  ctx.body = result
})

router.get('/detail', async (ctx, next) => {
  const result = await getProblemDetail(ctx)
  ctx.body = result
})

router.post('/update', async (ctx, next) => {
  const result = await updateProblem(ctx)
  ctx.body = result
})

router.post('/import', async (ctx, next) => {
  const result = await importProblem(ctx)
  ctx.body = result
})

router.post('/export', async (ctx, next) => {
  const result = await exportProblem(ctx)
  ctx.body = result
})

router.post('/judge', async (ctx, next) => {
  const result = await judgeProblem(ctx)
  ctx.body = result
})

module.exports = router
