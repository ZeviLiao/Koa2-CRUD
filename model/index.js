const query = require('../utils/query')
//用户表
const users = `create table if not exists users(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(20) NOT NULL,
 phone CHAR(11) NOT NULL,
 password VARCHAR(20) NOT NULL,
 avator VARCHAR(255) DEFAULT 'default.jpg',
 credit INT NOT NULL DEFAULT 0 ,
 useCredit INT NOT NULL DEFAULT 0 ,
 cash INT NOT NULL DEFAULT 0 ,
 isReal TINYINT NOT NULL DEFAULT 0,
 PRIMARY KEY (id)
);`

const createTable = function(tb){
  query(tb,function(res){
    console.log('建表成功');
    return true;
  },function(err){
    console.log('建表失败',err);
    return false;
  })
}
createTable(users);
