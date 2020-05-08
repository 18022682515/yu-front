# yu-front
  *仅用于web前端，在webpack中引入本模块，即可使用下面dom对象的扩展函数，IE10及以上*
  
### 安装
```
npm install yu-front --save
```
  
### 引入
```javascript
import { 
    el,
    $,
    getSite,
    animate,
    ajax, 
    cookie, 
    examineUser,
    tick,
    clearTick,
    getMatrix,
    css
} from 'yu-front';
```

### `el('css元素选择器')` 返回dom对象

### `$('css元素选择器')` 返回数组，含多个dom对象

### 扩展了dom对象的函数：
```javascript
let box = el('#box') || document.getElementById('box');
box.addClassName('className1','className2',……);  //增加类名
box.removeClassName('className1','className2',……);  //删除类名
box.ClassIsExist('className1');   //判断类名是否存在，返回布尔值
```

### 获取元素在文档中的坐标（元素的左上角）
```javascript
let { top,left } = getSite(el('div'));  //获取某个div在文档中的坐标
```

### css3过渡动画——dom元素的队列动画：`animate()`;
```javascript
1、简单的使用示例：
let box = el('#box');
//animate( 元素对象, 动画1, 动画2 );
animate( box, [{ width:'100px',height:100 }],[{ transform:{ scale:[2,2],translate:['100%','100%'] } }] );
//box元素的动画顺序：1、500毫秒宽高变成100px; 2、再接着500毫秒，x轴和y轴分别放大2倍、偏移100%;

2、如果需要给每一步动画设置：动画持续时间(默认500ms)和延迟时间(默认0ms)、动画缓动效果(默认ease-out)，如下例：
animate( box, [{ width:'100px',height:100 },{ duration:1000,delay:500,timing:'ease-out' }], [{ transform:{ scale:[2,2],translate:['100%','100%'] } },{ duration:2000,delay:1000 }] );

3、如果需要动画倒放，设置options:
//reverse：整个队列动画的倒放次数，设为true则无限循环，默认为false。
//reverseDelay：动画倒放时，是否计算设定的动画延迟时间，默认为false。
//endClose: 队列动画结束时，是否设置box.style.transition = ''，默认为false。
let options = { reverse:true, reverseDelay:true, endClose:true };
//animate( 元素对象, 动画选项对象, 动画1, 动画2 );
animate( box, options, [{ width:'100px',height:100 }], [{ transform:{ scale:[2,2],translate:['100%','100%'] } }] );

4、animate函数返回Promise对象：
let promise = animate(box, options, 动画1, 动画2, 动画3,……);

5、如果开启了队列动画无限循环(即options.reverse===true)，animate函数立即返回promise，promise的resolve函数的参数是options对象，设置options.reverse=false可以关闭队列动画的无限循环，如下：
promise.then(options=>{ options.reverse = false; }); //关闭列队动画的无限循环

6、如果没有开启队列动画无限循环(即options.reverse!==true)，则队列动画全部执行完后，才返回promise，promise的resolve函数的参数是队列动画对象。
promise.then(aniRecord=>{ console.log(aniRecord) });
//aniRecord是最后一次倒放的队列动画对象。

```

### `ajax(method, url, data，header)`：向服务器发送请求，返回Promise
```javascript
//post请求:
let p = ajax('post', '/getData', {user:'deng',password:'123456'});
p.then( result=>{
    let { headers,data } = result;
    //headers是响应头
    //data是响应数据
} );

//get请求：
let p = ajax('get', '/getData',{user:'deng',password:'123456'});
p.then( result=>{
    let { headers,data } = result;
    //headers是响应头
    //data是响应数据
} );

//如果需要添加请求header：
let p = ajax('get', '/getData',{ user:'deng',password:'123456' },{ 'header字段':'字段值' });
p.then( result=>{
    let { headers,data } = result;
    //headers是响应头
    //data是响应数据
} );
```
  
### `cookie`：document.cookie增删改查
```javascript
/* cookie.set(key,value,expires) */
cookie.set('abc','123',3600);   //增或改cookie，该cookie的有效时间是3600秒以内

/* cookie.get(key) */
cookie.get('abc');     //获取指定cookie
cookie.get();          //获取所有cookie

/* cookie.delete(key) */
cookie.delete('abc');  //删除指定的cookie

/* cookie.clear() */
cookie.clear();        //清空cookie(删除所有cookie)
```

### `examineUser(str,count)`：用于检验用户名和密码是否合法，判定规则：用这些字符，A-Z、a-Z、0-9、_，6位或以上到32位非纯数字，属于合法规则，函数返回true或false，合法是true
```javascript
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

### `tick(calback)、clearTick(timer)`：window.requestAnimationFrame和window.cancelAnimationFrame的简写
```javascript
let num = 0;
function fn(){
    conosle.log(num++);
    if(num<100) tick(fn);
}
fn();
```

### 将css3的transform属性转换成矩阵字符串,并返回
```javascript
let matrix = getMatrix({ scale:[2,2],translate:[50,30], rotate:222, skew:[45,30] });

console.log(matrix);  //"matrix(-0.7136441795461799,-2.1963709427902183,-0.1480284382370718,-2.8245508636725045,100,60)"
```


### 获取或设置dom元素的css属性（已含兼容性处理）
```javascript
let ele = el("div");

let str = css(ele,"width");  //获取dom元素当前样式的width

css(ele,{ width:"100px",height:"50px" });  //设置dom元素的width和height
```