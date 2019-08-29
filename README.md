# yu-front
  *仅用于web前端，在webpack中引入本模块，即可使用下面dom对象的扩展函数，IE10及以上*
  
### 安装
```
npm install yu-front --save
```
  
### 引入
```javascript
const { 
    el, 
    $,
    getSite,
    animate,
    shape,
    ajax, 
    getCookies, 
    examineUser,
    tick,
    clearTick,
    getMatrix,
    inertia
} = require('yu-front');
```

### `el('css元素选择器')` 返回dom对象

### `$('css元素选择器')` 返回数组，含多个dom对象

### 扩展了dom对象的函数：
```javascript
let box = el('#box') || document.getElementById('box');
box.addClassName('className1','className2',……);  //增加类名
box.removeClassName('className1','className2',……);  //删除类名
box.emptyClass();  //清空类名
box.ClassIsExist('className1');   //判断类名是否存在，返回布尔值
box.ClassIsNum();    //判断是否有纯数字的类名，返回布尔值
box.filterNaNClass();   //过滤掉非数字的类名
```

### dom元素的帧速动画：基于元素绝对定位的位移动画
```javascript
let box = el('#box');
box.speedAni({ x:5,y:5 }, { x:500,y:300 });
//box.speedAni(帧速对象, 位移范围对象);
//{x:5,y:5}表示每一帧box元素：x轴位移5px，y轴位移5px
//{x:500,y:300}表示box元素在指定的范围内移动：x轴是0到500px，y轴是0到300px
```

### 获取标签元素左上角，在文档中的坐标
```javascript
let { top,left } = getSite(el('div'));  //获取某个div在文档中的坐标
```

### dom元素的队列动画函数(css过渡动画)：`animate()`;
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

### svg的path图形变化动画（仅支持大写字母的绘画）(仅作用于html中的svg)
```javascript
//获取svg中的path元素对象
let path = el('path');
//参数说明：(path元素,{ reverse:循环次数 },{ d:'第一个图形' },{ d:'第二个图形' });
shape(path,{ reverse:true },{ d:'M10 10 H90 V90 H10 Z' },{ d:'M50 10 L80 90 L10 40 L90 40 L20 90 Z' },……);
//第一个图形到第二个图形的变化过程动画
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
  
### `getCookies()`：将document.cookie解析成对象，返回对象
```javascript
let obj = getCookies();
console.log(obj);   //{ 'key':'value' }
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

### 手机端：手指滑动元素的惯性移动
```javascript
inertia({
    ele:el('#app'),  //绑定dom元素
    type:"*",   //"*|x|y"   x轴或y轴的移动方向，*是x和y
    touchstart(e){   //手指按下事件
        console.log('start');
    },
    touchmove(e){   //手指移动事件
        console.log('move');
    },
    touchend(e){     //手指离开事件
        console.log('end');
    },
    complete(){     //移动惯性结束时触发事件
        console.log("惯性结束");
    }
});
```