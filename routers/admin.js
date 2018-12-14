const router = require('koa-router')();
const Sql = require('../utils/sql');
const jwt = require('jsonwebtoken');
const Token = require('../utils/token');
const query = require('../utils/query');
const tbName = 'admin';
const notoken = {
  code:401,
  message:'invalid token'
};
function signIn(name,pwd){
  return new Promise((resolve,reject)=>{
    query(`select * from ${tbName} where name='${name}' and password=${pwd}`,function(res){
      if (res.length==0) {
        resolve({
          code:200,
          message:'用户名密码错误'
        })
      }else {
        const token = jwt.sign({id:res[0].id}, 'token', {expiresIn: '15d'})
        resolve({
          code:200,
          message:'登录成功',
          data:{
            user:res[0],
            token:token
          }
        })
      }
    },function(err){
      resolve({
        code:200,
        message:'登录失败',
        data:err
      })
    })
  })
}
router
  .get('/api/cms/admin',async(ctx,next)=>{ //超级管理员才能获取所有管理员记录
    let word = ctx.query.keyword;
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token && data.id==1) {
      if (word) {
        let res = await Sql.searchVague(tbName,ctx.query.keyword,['name']);
        ctx.body = res;
      }else {
        let res = await Sql.queryAll(tbName);
        ctx.body = res;
      }
    }else {
      ctx.body = notoken;
    }
  })
  .post('/api/cms/admin',async(ctx,next)=>{ //超级管理员才能新增管理员
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token && data.id==1) {
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
  .del('/api/cms/admin',async(ctx,next)=>{ //超级管理员才能删除管理员
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token && data.id==1) {
      let index = ctx.request.body.ids.indexOf(1);
      if (index!=-1) {
        ctx.request.body.ids.splice(index,1);
      }
      let res = await Sql.deleteRows(tbName,ctx.request.body.ids);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .put('/api/cms/admin/:id',async(ctx,next)=>{ //超级管理员才能修改管理员
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token && data.id==1) {
      let res = await Sql.update(tbName,ctx.params.id,ctx.request.body);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .del('/api/cms/admin/:id',async(ctx,next)=>{ //删除
    let data = Token.decrypt(ctx.header.authorization);
    if (data.token && data.id==1 && ctx.params.id!=1) {
      let res = await Sql.update(tbName,ctx.params.id);
      ctx.body = res;
    }else {
      ctx.body = notoken;
    }
  })
  .post('/api/cms/admin/signIn',async(ctx,next)=>{ //登录
    let now = new Date();
    let str = now.toLocaleDateString().replace(/\//g,"-")+' '+now.toTimeString().substr(0,8);
    let obj = {
      lastSign:str
    }
    let data = await signIn(ctx.request.body.name,ctx.request.body.password);
    let update = await Sql.update(tbName,data.data.user.id,obj);
    ctx.body = data;
  })
  module.exports = router;
