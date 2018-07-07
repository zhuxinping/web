const http=require('http');

let server=http.createServer((req, res)=>{
    let lang=req.headers['accept-language'].split(';')[0].split(',')[0];

    switch(lang.toLowerCase()){
        case 'zh-cn':
            res.setHeader({location: 'http://localhost/cn/'});
            res.writeHeader(302);
            break;
        default:
            res.setHeader({location: 'http://localhost/'});
            res.writeHeader(302);
            break;
    }
});
server.listen(8080);
