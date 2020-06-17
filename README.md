# yu-front
  *仅用于web前端，在webpack中引入本模块，即可使用下面dom对象的扩展函数，IE10及以上*
  
### 安装
```
npm install yu-front --save
```
  
### 引入
```javascript
import { 
		queueAnimate,
		css,
		ajax, 
		upload,
		cookie, 
		tick,
		clearTick,
		getSite
} from 'yu-front';
```

### 队列动画：`queueAnimate(元素,队列动画数组,config)`;
```javascript
let div = document.querySelector('div');
let queue = [{ width:'200px' },{ width:'300px',height:'50px' }];
let config = { duration:300,delay:0,timing:'ease' };

//队列动画
queueAnimate(div,queue,config).then(record=>{
	//动画完成
	console.log(record) //record记录该div的css样式
})

//非队列动画
queueAnimate(div,{ width:'100px',height:'100px' },300).then(record=>{
	//动画完成
	console.log(record) //record记录该div的css样式
})
```


### 获取或设置dom元素的css属性（已含兼容性处理）
```javascript
let div = document.querySelector('div');
//获取dom元素当前样式的width
let str = css(div,"width");  

//设置dom元素的width和height
css(div,{ width:"100px",height:"50px" });  
```


### `ajax(options)`：向服务器发送请求，返回Promise
```javascript

let options = {
	method:'get'|'post'|'put'|'delete',  //请求方法
	url:'xxx/api',   			//请求地址
	data:{ id:1,user:'ming' }|'id=1&user=ming', //请求参数
	header:{ '请求头字段','字段值' },  //请求头
	type:''|'json'|'blob'|'arraybuffer'|'document', //响应的数据类型
}

ajax(options).then( result=>{
    let { headers,data } = result;
    //headers是响应头
    //data是响应数据
} );
```


### ajax上传文件：`upload(input元素,'服务器url',上传进度回调函数).then(上传成功回调函数)`
```javascript
let input = document.getElementById('input_id');

input.oninput = function(event){
	upload(event.currentTarget,'/服务器地址',(e)=>{
		console.log(e);
	}).then(res=>{});		//上传成功回调
}

//如果上传文件时，也需要发送参数数据
input.oninput = function(event){
	upload(event.currentTarget,{ url:'/服务器地址',data:{ id:2,username:'小明' } },(e)=>{
		console.log(e);
	}).then(res=>{});		//上传成功回调
}
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


### `tick(calback)、clearTick(timer)`：window.requestAnimationFrame和window.cancelAnimationFrame的简写
```javascript
let num = 0;
function fn(){
    conosle.log(num++);
    if(num<100) tick(fn);
}
fn();
```


### 获取元素在文档中的坐标（元素的左上角）
```javascript
let div = document.querySelector('div')
let { top,left } = getSite(div);  //获取某个div在文档中的坐标
```
