const router = require('koa-router')();   //路由
const Sql = require('../utils/sql');
const tbName = 'apples';
 router
  .get('/api/apples',async(ctx,next) => {
    let data = await Sql.queryAll(tbName,ctx.request.query);
    ctx.body = data;
  })
  .get('/api/apples/:id',async(ctx,next) => {
    let data = await Sql.query(tbName,ctx.params.id);
    ctx.body = data;
  })

  .post('/api/apples',async(ctx,next) => {
    let data = await Sql.insert(tbName,ctx.request.body);
    ctx.body = data;
  })
  .post('/api/apples/rows',async(ctx,next) => {
    let data = await Sql.insertRows(tbName,ctx.request.body);
    ctx.body = data;
  })

  .put('/api/apples/:id',async(ctx,next) => {
    let data = await Sql.update(tbName,ctx.params.id,ctx.request.body);
    ctx.body = data;
  })
  .put('/api/apples',async(ctx,next) => {
    console.log(ctx.request.body);
    let data = await Sql.updateRows(tbName,ctx.request.body);
    ctx.body = data;
  })

  .del('/api/apples/:id',async(ctx,next) => {
    let data = await Sql.delete(tbName,ctx.params.id);
    ctx.body = data;
  })
  .del('/api/apples',async(ctx,next) => {
    let data = await Sql.deleteRows(tbName,ctx.request.body);
    ctx.body = data;
  })
module.exports = router;
