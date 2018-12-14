const router = require('koa-router')();
const Sql = require('../utils/sql');
const Token = require('../utils/token');
const tbName = 'loans';
const notoken = {
  code:401,
  message:'invalid token'
};
router
  .get('/api/cms/loans',async(ctx,next)=>{ //获取所有借贷配置记录
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.queryAll(tbName);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .post('/api/cms/loans',async(ctx,next)=>{ //新增借贷配置
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.insert(tbName,ctx.request.body);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .del('/api/cms/loans',async(ctx,next)=>{ //删除借贷配置
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.deleteRows(tbName,ctx.request.body.ids);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .put('/api/cms/loans/:id',async(ctx,next)=>{ //修改借贷配置
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.update(tbName,ctx.params.id,ctx.request.body);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .get('/api/loans',async(ctx,next)=>{ //用户端获取借贷配置
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,{isShow:1});
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
module.exports = router;
