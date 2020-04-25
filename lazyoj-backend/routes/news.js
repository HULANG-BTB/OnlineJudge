const router = require('koa-router')()

const {
  getNewsList,
  toggleNewsStatus,
  updateNews,
  deleteNews,
  addNews
} = require('../controller/news')

router.prefix('/news')

router.get('/list', async (ctx, next) => {
  const result = await getNewsList(ctx)
  console.log(ctx.request)
  ctx.body = result
})

router.post('/toggleNewsStatus', async (ctx, next) => {
  const result = await toggleNewsStatus(ctx)
  ctx.body = result
})

router.post('/update', async (ctx, next) => {
  const result = await updateNews(ctx)
  ctx.body = result
})

router.post('/delete', async (ctx, next) => {
  const result = await deleteNews(ctx)
  ctx.body = result
})

router.post('/add', async (ctx, next) => {
  const result = await addNews(ctx)
  ctx.body = result
})

module.exports = router
