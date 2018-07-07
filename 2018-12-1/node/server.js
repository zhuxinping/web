const http=require('http');
const io = require('socket.io');

let server=http.createServer();
server.listen(8081);

let wsServer=io.listen(server);
wsServer.on('connection',sock=>{
    sock.on('msg',function (...arg) {
        console.log(...arg);
    });
});