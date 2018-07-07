const http=require('http');
const fs=require('fs');
fs.readFile('1.txt',(err,data)=>{
    if(!err){
        console.log('读取文件成功'+data.toString());
    }else{
        console.log(err+'读取文件失败!');
    }
});

fs.writeFile('2.txt','随便一段文字',err=>{
    if(!err){
        console.log('写入文件成功');
    }else{
        console.log(err+'写入文件失败!');
    }
});