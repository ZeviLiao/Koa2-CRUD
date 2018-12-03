const router = require('koa-router')();   //路由
const Sql = require('../utils/sql');
const query = require('../utils/query');
const Tools = require('../utils/tools');
const jwt = require('jsonwebtoken');
const Token = require('../utils/token')
const tbName = 'users';
const preUrl = '/api/users';
let codeList = {};
function register(data){
  return new Promise((resolve,reject)=>{
    query(`select * from ${tbName} where phone=${data.phone}`,function(res){
      if (res.length==0) {
        if (codeList[data.phone]==data.code) {
          query(`insert into ${tbName} (phone,password,name) values (${data.phone},${data.password},'用户名')`,function(res){
            // let id = res.insertId;
            resolve({
              code:200,
              message:'注册成功'
            })
          },function(err){
            resolve({
              code:200,
              message:'注册失败',
              data:err
            })
          })
        }else {
          resolve({
            code:200,
            message:'验证码错误'
          })
        }
      }else {
        resolve({
          code:200,
          message:'该手机号码已被注册'
        })
      }
    },function(err){
      resolve({
        code:200,
        message:'请求失败',
        data:err
      })
    })
  })
}
function signIn(phone,pwd){
  return new Promise((resolve,reject)=>{
    query(`select * from ${tbName} where phone=${phone} and password=${pwd}`,function(res){
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
 .get(`${preUrl}/getCode`,(ctx,next) => { //获取验证码
   let phone = ctx.request.query.phone;
   if (phone && Tools.isPhone(phone)) {
     let code = parseInt(Math.random()*10000).toString();
     if (code<1000) {
       code = `0${code}`;
     }
     ctx.body = {
       code:200,
       message:'success',
       data:{
         phone:`${phone}`,
         code:code
       }
     };
     codeList[phone] = `${code}`;
   }else {
     ctx.body = {
       code:401,
       message:'failed',
       data:'手机号码格式错误'
     };
   }
 })
 .post(`${preUrl}/register`,async(ctx,next) =>{ //注册
   let data = await register(ctx.request.body);
   ctx.body = data;
 })
 .post(`${preUrl}/signIn`,async(ctx,next) =>{ //登录
   let data = await signIn(ctx.request.body.phone,ctx.request.body.password);
   ctx.body = data;
 })
 .get('/api/users',async(ctx,next)=>{
   const token = ctx.header.authorization;
   let data = Token.decrypt(token);
   console.log(data);
   if (data.token) {
     let res = await Sql.query(tbName,data.data);
     ctx.body = res;
   }else {
     ctx.body = {
       code:401,
       message:'failed',
       data:data
     };
   }
 })
module.exports = router
