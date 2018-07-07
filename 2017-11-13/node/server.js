const http=require('http');

let server=http.createServer(function (req,res) {
    //console.log('有人连接');
    //request  请求 --输入
    console.log(req.url);
    console.log(req.method);
    //response 响应--输出
    if(req.url=='/aaa'){
        res.write('aaa');
    }else if(req.url=='/index.html'){
        res.write('index');
    }else{
        res.write('404');
    }

    res.end();
});

server.listen(8080);