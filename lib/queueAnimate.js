import { getType } from 'yu-util';
import { getCssKey,stopCss } from './stopCss.js';

function queueAnimate(el,queue,config){
	let duration = null;
	if(getType(config,'Number')){
		duration = config;
	}
	config = getType(config,'Object')? config: { duration };
	duration = getType(config.duration,'Number')? config.duration: 300;
	let delay = getType(config.delay,'Number')? config.delay: 0;
	let timing = getType(config.timing,'String')? config.timing: 'linear';
	el.style[getCssKey(el,'transition')] = `all ${duration/1000}s ${timing} ${delay/1000}s`;
	
	getType(queue,'Object') && (queue = [ queue ])

	return new Promise(res=>{
		let length = queue.length;
		let init = [];
		let i = 0;
		
		//获取动画队列中的所有css属性名，去掉重复的
		let keys = Array.from(new Set(queue.flatMap(o=>Object.keys(o))));
		(function fn(){
			let cssObj = queue[i];
			let obj = {};
			
			//添加上一次的css样式记录
			init.unshift(obj);  
			
			//获取初始的css样式
			keys.forEach(key=>{
				obj[key] = getComputedStyle(el)[getCssKey(el,key)];
			})
			if(i!==0){
				//记录上一次的css样式
				Object.keys(queue[i-1]).forEach(key=>{
					obj[key] = queue[i-1][key]
				})
			}
			
			//设置css样式
			Object.keys(cssObj).forEach(key=>{
				el.style[getCssKey(el,key)] = cssObj[key]
			})
			
			i++;
			setTimeout(()=>{
				if(i<length){
					fn();
				}else{
					res(init)
				}
			},duration)
		})()
	})
}

export default queueAnimate;