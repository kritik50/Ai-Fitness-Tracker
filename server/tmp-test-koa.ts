import Koa from 'koa';
const app = new Koa();

app.use(async ctx => {
    try {
        console.log(ctx.internalServerError);
    } catch(e){}
});

app.listen(1338);
