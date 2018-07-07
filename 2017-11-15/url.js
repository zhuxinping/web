const url = require("url");
let str='https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_2548884195004841348%22%7D&n_type=0&p_from=1';
let {pathname,query}=url.parse(str,true);
console.log(pathname,query);