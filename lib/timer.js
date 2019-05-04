function fn(){
    let obj = {};
    const browsers = ['webkit', 'moz'];
    browsers.forEach(val=>{
        obj.tick = window[val+'RequestAnimationFrame'];
        obj.clearTick = window[val+'CancelAnimationFrame'] || window[val+'CancelRequestAnimationFrame'];
    });
    if(!obj.tick){
        obj.tick = function(callback,...args){
            window.setTimeout(callback,1000/60,...args);
        }
        obj.clearTick = window.clearTimeout;
    }
    return obj;
}

module.exports = fn();