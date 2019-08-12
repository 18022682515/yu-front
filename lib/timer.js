const { tick,clearTick } = (function(){
    let tick = null, clearTick = null;
    if(window.requestAnimationFrame){
        tick = window.requestAnimationFrame;
        clearTick = window.cancelAnimationFrame;
    }else{
        const browsers = ['webkit', 'moz'];
        browsers.forEach(val=>{
            tick = window[val+'RequestAnimationFrame'];
            clearTick = window[val+'CancelAnimationFrame'] || window[val+'CancelRequestAnimationFrame'];
        });
    }
    
    if(!tick){
        tick = function(callback){
            return window.setTimeout(callback,1000/60);
        }
        clearTick = window.clearTimeout;
    }
    return { tick,clearTick };
})();

export { tick,clearTick };