const Koa = require('koa')

const KoaRouter = require('@koa/router')


const app = new Koa()

const router = new KoaRouter()

// cors跨域处理
app.use(async (ctx, next) => {
    // 允许来息所有域名的请求
    ctx.set('Access-Control-Allow-Origin', '*')

    // 允许HTTP请求的方法
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS,DELETE,GET,PUT,POST')

    // 表明服务器支持所有头信息字段
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, token')

    // 设置请求preflight缓存的时间
    ctx.set('Access-Control-Max-Age', 10)

    // Content-Type表示具体请求中的媒体类型信息
    // ctx.set('Content-Type', 'application/json;charset=utf-8')

    await next()
})


router.get('/', async (ctx, next) => {
    ctx.body = {key: 'koa get test'}
})

router.post('/', async (ctx, next) => {
    console.log('post');
    ctx.body = {key: 'koa post test'}
})

router.put('/', async (ctx, next) => {
    console.log('put');
    ctx.body = {key: 'koa put test'}
})

// router.options('/', async (ctx, next) => {
//     console.log('options');
//     ctx.body = ''
// })




app.use(router.routes())
app.use(router.allowedMethods())



app.listen(3000)