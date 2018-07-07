//请求文件 然后在文件上填写表单请求接口跟数据库对接
const http = require("http");
const fs = require("fs");
const mysql = require("mysql");
const io = require("socket.io");
const url = require("url");
const regs=require('./libs/regs');
//数据库
let db=mysql.createPool({host:'localhost',user:'root',password:'123456',database:'2017113'});
//1.http服务器

let httpServer= http.createServer((req,res)=>{
    //req.url=>/reg?user=1&pass=123456  要拆分
    // let [path,str]=req.url('?');
    // str.split('&').forEach();
    let {pathname,query} =url.parse(req.url,true);//解析路径和参数
    if(pathname=='/reg'){
        let {user, pass}=query;
        //1.校验数据
        if(!regs.username.test(user)){
            res.write(JSON.stringify({code: 1, msg: '用户名不符合规范'}));
            res.end();
        }else if(!regs.password.test(pass)){
            res.write(JSON.stringify({code: 1, msg: '密码不符合规范'}));
            res.end();
        }else{
            //2.检验用户名是否重复
            db.query(`SELECT ID FROM user_table WHERE username='${user}'`, (err, data)=>{
                if(err){
                    res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
                    res.end();
                }else if(data.length>0){
                    res.write(JSON.stringify({code: 1, msg: '此用户名已存在'}));
                    res.end();
                }else{
                    //3.插入
                    db.query(`INSERT INTO user_table (username,password,online) VALUES('${user}','${pass}',0)`, err=>{
                        if(err){
                            res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
                            res.end();
                        }else{
                            res.write(JSON.stringify({code: 0, msg: '注册成功'}));
                            res.end();
                        }
                    });
                }
            });

        }

    }else if(pathname=='/login'){
        //登录接口
        let {user,pass}=query;
        console.log("请求了登录");
        //1.校验登录
        if(!regs.username.test(user)){
            res.write(JSON.stringify({code: 1, msg: '用户名不符合规范'}));
            res.end();
        }else if(!regs.password.test(pass)){
            res.write(JSON.stringify({code: 1, msg: '密码不符合规范'}));
            res.end();
        }else {
            //2.获取数据
            db.query(`SELECT ID,password FROM user_table WHERE username='${user}'`,(err,data)=>{
                console.log(data);
                if(err){
                    res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
                    res.end();
                }else if(data.length==0){
                    res.write(JSON.stringify({code: 1, msg: '此用户名不存在'}));
                    res.end();
                }else if(data[0].password!=pass){
                    res.write(JSON.stringify({code: 1, msg: '此用户名或密码有误'}));
                    res.end();
                }else{
                    //3.设置状态
                    db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`,err=>{
                      if(err){
                          res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
                          res.end();
                      }else{
                          res.write(JSON.stringify({code: 0, msg: '登录成功!'}));
                          res.end();
                      }
                    })
                }
            });
        }
    } else {
        console.log("请求了文件");
        fs.readFile(`www${pathname}`,(err,data)=>{
            if(err){
                res.writeHeader(404);
                res.write("NotFound");
            }else{
                res.write(data);
            }
            res.end();
        });
    }

});
httpServer.listen(8080);