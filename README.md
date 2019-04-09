# yu-front
  *仅用于web前端*
  
# 安装
```
npm install yu-front --save
```
  
**引入**
```
const { ajax, getCookies, examineUser } = require('yu-front');
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
  
**`examineUser(str,count)`：用于检验用户名和密码是否合法，判定规则：用这些字符，A-Z、a-Z、0-9、_，6位或以上到32位非纯数字，属于合法规则，函数返回true或false，合法是true**
```
//合法：
let user = 'abcd1234';
examineUser(user);   //true

//不合法：
let user = '1234567';
examineUser(user);   //false，不能是纯数字

let user = 'abc12';
examineUser(user);   //false，必须是最少6位的字数

//如果最少6位无法满足，也可以修改最少字数
let user = 'abc12';
examineUser(user, 5);  //true，修改为最少5位的字数
```