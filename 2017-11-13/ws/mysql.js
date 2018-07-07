const mysql = require('mysql');
//1链接
//连接池
let db=mysql.createPool({host:'localhost',user:'root',password:'123456',database:'2017113'});//默认10个
//let db=mysql.createConnection({host:'localhost',user:'root',password:'123456',database:'2017113'});
//数据库操作也是异步操作
//2查询
db.query(`SELECT *FROM user_table`,(err,data)=>{
    if(err){
        console.log(err);
    }else{
        //console.log(JSON.stringify(data));
        console.log(data);
    }
});
//console.log(db);
