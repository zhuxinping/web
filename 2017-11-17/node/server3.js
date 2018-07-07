const http=require('http');
const url=require('url');

let server=http.createServer(function (req, res){
  let {pathname, query}=url.parse(req.url, true);
  let {a,b,callback}=query;

  res.write(`${callback}(${parseInt(a)+parseInt(b)})`);
  res.end();
});
server.listen(8080);
