# yu-front
  *仅用于web前端，在webpack中引入本模块，即可使用下面dom对象的扩展函数，IE10及以上*
  
### 安装
```
npm install yu-front --save
```
  
### 引入
```
const { el, $, tick, clearTick, ajax, getCookies, getJSON, examineUser, TWEEN } = require('yu-front');
```

### 扩展了dom对象的函数：
```
let box = el('#box') || document.getElementById('box');
box.addClassName('className1','className2',……);  //增加类名
box.removeClassName('className1','className2',……);  //删除类名
box.emptyClass();  //清空类名
box.ClassIsExist('className1');   //判断类名是否存在，返回布尔值
box.ClassIsNum();    //判断是否有纯数字的类名，返回布尔值
box.filterNaNClass();   //过滤掉非数字的类名
```

### dom对象的队列动画：js操作css:
```
let box = el('#box') || document.getElementById('box');

//options.reverse说明：整个队列动画的倒退次数，设为true则无限循环。
//options.reverseDelay说明：动画倒退时，是否计算设定的动画延迟时间。
let options = { reverse:true, reverseDelay:true };

//动画1：数组的第一个对象是css属性对象，第二个对象是该动画的配置：duration是动画持续时间(毫秒)，delay是动画延迟时间(毫秒)，reverse是该动画的倒放次数，如果为true，则该动画无限循环。
let queueAni1 = [{ width:200, transform:{rotate:'45deg'}, margin:[20,10,10,20], border:'10px solid #000' },{ duration:800, timing:'ease-out', delay:300, reverse:2 };
 
//动画2：设置该元素的width和opacity，动画持续1500毫秒
let queueAni2 = [{ width:"100%", opacity:0.4 }, { duration:1500 }];

//队列动画：执行完queueAni1的动画，才执行queueAni2的动画，如果有queueAni3或更多，则以此类推。
let pro = box.animate(options, queueAni1, queueAni2,……);
//队列动画全部完成，返回Promise对象
pro.then(aniRecord=>{ console.log(aniRecord) });

//支持所有样式属性，比如css属性是background-color:#000,请用js的方式：{backgroundColor:'#000'}，或{background:'#000'}
```

### `el('css元素选择器')` 返回dom对象

### `$('css元素选择器')` 返回数组，含多个dom对象

### `TWEEN` 补间动画库：
```
let obj = { x: 100 };
//动画延迟200毫秒开始，obj.x从100到200，总持续时间为1000毫秒，动画重复2次
new TWEEN.Tween(obj).delay(200).to({x:200},1000).repeat(2).easing(TWEEN.Easing.Elastic.InOut).onUpdate(每一帧触发的函数).start();

//更新动画帧状态
(function fn(){ if(TWEEN.update(){ setTimeout(fn,20);} })()
``` 

### `ajax(method, url, data，header)`：向服务器发送请求，返回Promise
```
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
```
let obj = getCookies();
console.log(obj);   //{ 'key':'value' }
```

### `tick(calback)、clearTick(timer)`：window.requestAnimationFrame和window.cancelAnimationFrame的简写
```
let num = 0;
function fn(){
    conosle.log(num++);
    if(num<100) tick(fn);
}
fn();
```

### `examineUser(str,count)`：用于检验用户名和密码是否合法，判定规则：用这些字符，A-Z、a-Z、0-9、_，6位或以上到32位非纯数字，属于合法规则，函数返回true或false，合法是true
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