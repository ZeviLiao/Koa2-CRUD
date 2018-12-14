const router = require('koa-router')();
const Sql = require('../utils/sql');
const Token = require('../utils/token');
const tbName = 'applys';
const notoken = {
  code:401,
  message:'invalid token'
};
router
  .get('/api/cms/apply',async(ctx,next)=>{ //获取所有贷款申请记录
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,{status:ctx.query.status});
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .put('/api/cms/apply/:id',async(ctx,next)=>{ //修改贷款申请
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.update(tbName,ctx.params.id,ctx.request.body);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .get('/api/apply',async(ctx,next)=>{ //用户端获取贷款申请
    let status = ctx.query.status;
    let obj = {userId:data.id};
    if (status) {
      obj = {
        status:status,
        userId:data.id
      }
    }
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,obj);
      let user = await Sql.query('users',data.id);
      // let loansId =
      // let loans = await Sql.query('users',data.id);
      // let platforms = await Sql.query('users',data.id);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .post('/api/apply',async(ctx,next)=>{ //用户端提交贷款申请
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let now = new Date();
      let str = now.toLocaleDateString().replace(/\//g,"-")+' '+now.toTimeString().substr(0,8);
      let obj = {
        ...ctx.request.body,
        userId:data.id,
        applyDate:str
      }
      let res = await Sql.insert(tbName,obj);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .put('/api/apply/:id',async(ctx,next)=>{ //用户端修改贷款申请
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.update(tbName,ctx.params.id,ctx.request.body);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
module.exports = router;
