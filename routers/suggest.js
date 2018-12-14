const router = require('koa-router')();
const Sql = require('../utils/sql');
const Token = require('../utils/token');
const tbName = 'advices';
const notoken = {
  code:401,
  message:'invalid token'
};
router
  .get('/api/cms/advices',async(ctx,next)=>{ //获取所有投诉记录
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.queryAll(tbName);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .post('/api/advices',async(ctx,next)=>{ //用户端提交投诉
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let now = new Date();
      let str = now.toLocaleDateString().replace(/\//g,"-")+' '+now.toTimeString().substr(0,8);
      let obj = {
        ...ctx.request.body,
        createDate:str
      }
      let res = await Sql.insert(tbName,obj);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .del('/api/cms/advices',async(ctx,next)=>{ //删除投诉
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.deleteRows(tbName,ctx.request.body.ids);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
module.exports = router;
