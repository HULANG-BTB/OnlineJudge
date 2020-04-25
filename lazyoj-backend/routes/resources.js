const router = require('koa-router')()

const {
    getDataFileList,
    uploadDataFile,
    deleteDataFile,
    downloadDataFile,
    uploadImage,
    readImage
} = require('../controller/resources')

router.prefix('/resources')

router.get('/getDataFileList', async (ctx, next) => {
    const result = await getDataFileList(ctx)
    ctx.body = result
})

router.post('/uploadDataFile', async (ctx, next) => {
    const result = await uploadDataFile(ctx)
    ctx.body = result
})

router.post('/deleteDataFile', async (ctx, next) => {
    const result = await deleteDataFile(ctx)
    ctx.body = result
})

router.get('/downloadDataFile', async (ctx, next) => {
    const result = await downloadDataFile(ctx)
    ctx.body = result
})

router.post('/uploadImage', async (ctx, next) => {
    const result = await uploadImage(ctx)
    ctx.body = result
})

router.get('/image', async (ctx, next) => {
    const result = await readImage(ctx)
    ctx.body = result
})

module.exports = router
