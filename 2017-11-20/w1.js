//3.接收
this.onmessage=function (ev) {
   // console.log(ev.data);
    let sum=ev.data.n1+ev.data.n2;
    //返回
    this.postMessage(sum);
}