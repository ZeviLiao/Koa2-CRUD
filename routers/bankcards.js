const router = require('koa-router')();
const Sql = require('../utils/sql');
const Token = require('../utils/token');
const tbName = 'bankcards';
const notoken = {
  code:401,
  message:'invalid token'
};
router
  .get('/api/bankcards',async(ctx,next)=>{
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,{userId:data.id});
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .post('/api/bankcards',async(ctx,next)=>{
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.insert(tbName,{userId:data.id,...ctx.request.body});
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .del('/api/bankcards/:id',async(ctx,next)=>{
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.delete(tbName,ctx.params.id);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .get('/api/bankcards/:id',async(ctx,next)=>{
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.query(tbName,ctx.params.id);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
module.exports = router;
