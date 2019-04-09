# yu-front
  *仅用于web前端*
  
# 安装
```
npm install yu-front --save
```
  
**引入**
```
const { ajax, getCookies } = require('yu-front');
```
  
**`ajax(method, url, data)`：向服务器发送请求，返回Promise**
```
//post请求:
let p = ajax('post', '/getData', 'user=deng&password=8888&');
p.then( data=>{
    console.log(data);
} );

//get请求：
let p = ajax('get', '/getData?user=deng&password=8888&');
p.then( data=>{
    console.log(data);
} );
```
  
**`getCookies()`：将document.cookie解析成对象，返回对象**
```
let obj = getCookies();
console.log(obj);   //{ 'key':'value' }
```
