const router = require('koa-router')();
const Sql = require('../utils/sql');
const query = require('../utils/query');
const Token = require('../utils/token');
const tbName = 'applys';
const notoken = {
  code:401,
  message:'invalid token'
};
const foreignKey = {
  loansId:{
    table:'loans',
    data:{
      title:'loansType'
    }
  },
  platformId:{
    table:'platforms',
    data:{
      title:'platformName',
      logo:'platformLogo'
    }
  }
};
router
  .get('/api/cms/apply',async(ctx,next)=>{ //获取所有贷款申请记录
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let status = ctx.query.status;
      let res = await Sql.search(tbName,status?{status:status}:{},foreignKey);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .put('/api/cms/apply',async(ctx,next)=>{ //批量修改贷款申请
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let req = ctx.request.body;
      let operate = req.operate;
      let obj;
      switch (operate) {
        case 'allow':obj={status:1};break;
        case 'reject':obj={status:2};break;
        case 'distribute':obj={platformId:req.platformId};break;
        case 'paid':obj={status:3};break;
        case 'cancel':obj={status:4};break;
      }
      let arr = [];
      for (let i = 0; i < req.ids.length; i++) {
        arr.push({
          id:req.ids[i],
          ...obj
        })
      }
      let res = await Sql.updateRows(tbName,arr);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .get('/api/apply',async(ctx,next)=>{ //用户端获取贷款申请
    let data = Token.decrypt(ctx.header.authorization);
    let status = ctx.query.status;
    let obj = {userId:data.id};
    if (status) {
      obj = {
        status:status,
        userId:data.id
      }
    }
    if (data.token) {
      let res = await Sql.search(tbName,obj,foreignKey);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .get('/api/apply/:id',async(ctx,next)=>{ //用户端获取贷款申请
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,{id:parseInt(ctx.params.id)},foreignKey);
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
  .get('/api/bills/pay',async(ctx,next)=>{  //获取待还账单
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,{userId:data.id,status:3,clear:0},foreignKey);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .get('/api/bills/clear',async(ctx,next)=>{  //获取已还账单
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token) {
      let res = await Sql.search(tbName,{userId:data.id,clear:1},foreignKey);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
module.exports = router;
