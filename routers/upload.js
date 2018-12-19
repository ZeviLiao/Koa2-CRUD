const router = require('koa-router')();   //路由
const fs = require('fs');

router.post('/api/upload',async(ctx,next)=>{
  const file = ctx.request.files.file;    // 报错
  const reader = fs.createReadStream(file.path);    // 创建可读流
  const ext = file.name.split('.').pop();        // 获取上传文件扩展名
  let fileName = new Date().getTime().toString()+'.'+ext;
  const upStream = fs.createWriteStream(`static/uploadFiles/${fileName}`);        // 创建可写流
  reader.pipe(upStream);    // 可读流通过管道写入可写流
  ctx.body = {
    code:200,
    message:'上传成功',
    data:`http://localhost:3000/uploadFiles/${fileName}`
  };
})
module.exports = router;
