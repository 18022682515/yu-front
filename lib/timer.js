let tick = null;
let clearTick = null;
if(window.requestAnimationFrame){
	tick = window.requestAnimationFrame;
	clearTick = window.cancelAnimationFrame;
}else{
	tick = function(callback){
		setTimeout(callback,1000/60);
	}
	clearTick = clearTimeout;
}

export { tick,clearTick };