const router = require('koa-router')();   //路由
const Sql = require('../utils/sql');
const Token = require('../utils/token');
const tbName = 'details';
const notoken = {
  code:401,
  message:'invalid token'
};
 router
   .get('/api/details',async(ctx,next)=>{
     let data = Token.decrypt(ctx.header.authorization);
     if(data.token){
       ctx.body = await Sql.query(tbName,data.id);
     }else {
       ctx.body = notoken;
     }
   })
   .post('/api/details',async(ctx,next)=>{
     let data = Token.decrypt(ctx.header.authorization);
     if(data.token){
       ctx.body = await Sql.insert(tbName,ctx.request.body);
     }else {
       ctx.body = notoken;
     }
   })
   .put('/api/details',async(ctx,next)=>{
     let data = Token.decrypt(ctx.header.authorization);
     if(data.token){
       ctx.body = await Sql.update(tbName,data.id,ctx.request.body);
     }else {
       ctx.body = notoken;
     }
   })
module.exports = router;
