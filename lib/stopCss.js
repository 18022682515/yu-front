import { getType } from 'yu-util';

function getCssKey(el,key){		//获取css的兼容性属性
	if(!getType(el.style[key],'Undefined')) return key;
	
	let prefix = [ 'webkit','ms','Moz','O' ];
	key = key.replace(key[0],key[0].toLocaleUpperCase());
	prefix = prefix.map(val=>val+key);
	return prefix.find(val=>!getType(el.style[val],'Undefined'))
}

function stopCss(el,keys){  //中断过渡中的css属性
	keys.forEach(key=>{
		key = getCssKey(el,key);
		el.style[key] = getComputedStyle(el)[key];
	})
}

export { getCssKey,stopCss }