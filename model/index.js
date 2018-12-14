const query = require('../utils/query')
const tables = {
  users:`create table if not exists users(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(20) NOT NULL,
   phone CHAR(11) NOT NULL,
   password VARCHAR(20) NOT NULL,
   avator VARCHAR(255) DEFAULT 'default.jpg',
   credit INT NOT NULL DEFAULT 0 ,
   useCredit INT NOT NULL DEFAULT 0 ,
   cash INT NOT NULL DEFAULT 0 ,
   isReal TINYINT NOT NULL DEFAULT 0
  );`,//用户表
  details:`create table if not exists details(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   qq	varchar(12),
   wechat	varchar(20),
   servePwd	char(6),
   realName	varchar(8),
   idcard	char(18),
   chsi	varchar(20),
   chsiPwd	varchar(20),
   school	varchar(20),
   education	varchar(10),
   type	varchar(10),
   department	varchar(20),
   grade	char(4),
   class	varchar(20),
   major	varchar(20),
   address	varchar(255),
   dormitory	varchar(20),
   foreign key(id) references users(id)
  );`,//用户详细信息表
  bankcards:`create table if not exists bankcards(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   userId INT NOT NULL,
   name	varchar(20),
   number	varchar(24),
   type	varchar(8),
   user varchar(8),
   phone char(11),
   foreign key(userId) references users(id)
  );`,//银行卡表
  admin:`create table if not exists admin(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name	varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
    role varchar(20),
    createDate varchar(20),
    lastSign varchar(20)
  )`,//管理员
  platforms:`create table if not exists platforms(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(20) not null,
    logo varchar(255) not null,
    isShow tinyint not null default 1
  );`,//第三方平台配置
  loans:`create table if not exists loans(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(20) not null,
    min int not null,
    max int not null,
    periods int not null,
    isShow tinyint not null default 1
  );`,//借贷配置
  advices:`create table if not exists advices(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    phone CHAR(11) NOT NULL,
    content varchar(255) not null,
    createDate varchar(20)
  )`,//投诉建议
  // status
  // 0待审核 1已通过 2未通过 3确定放款 4取消放款 5取消申请
  applys:`create table if not exists applys(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    platformId INT,
    loansId int,
    total int,
    periods int,
    monthMoney float,
    interest float,
    payDate int,
    status int default 0,
    applyDate varchar(20),
    donePeriods int default 0,
    clear int default 0,
    foreign key(userId) references users(id),
    foreign key(platformId) references platforms(id),
    foreign key(loansId) references loans(id)
  )`//借贷记录
};
const createTable = function(tb){
  query(tb,function(res){
    // console.log('建表成功');
    return true;
  },function(err){
    console.log('建表失败',err);
    return false;
  })
}

for (let key in tables) {
  if (tables.hasOwnProperty(key)) {
    createTable(tables[key]);
  }
}
