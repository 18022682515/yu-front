import { animate } from './animate.js';

export default (obj)=>{
    let downFn = obj.mousedown || obj.touchstart;
    let upFn = obj.mouseup || obj.touchend;
    let moveFn = obj.mousemove || obj.touchmove;
    let { el } = obj;
    let down = el['ontouchstart']===undefined ? 'mousedown' : 'touchstart';
    let move = el['ontouchmove']===undefined ? 'mousemove' : 'touchmove';
    let up = el['ontouchend']===undefined ? 'mouseup' : 'touchend';

    let x = 0, y = 0, sumX = 0, sumY = 0, speedX = [], speedY = [], time = 0;
    function mCallback(e){
        moveFn && moveFn(e);
        if(move==='touchmove'){
            e = e.changedTouches[0];
        }
        let mx = e.clientX;
        let my = e.clientY;
        speedX.push(mx - x);
        speedY.push(my - y);
        if(speedX.length>3){
            speedX.shift();
            speedY.shift();
        }
        sumX += mx - x;
        sumY += my - y;
        x = mx;
        y = my;
        el.style.transform = `translate(${sumX}px,${sumY}px)`;
        time = Date.now();
    }
    
    el.addEventListener(down,function(e){
        downFn && downFn(e);
        if(down==='touchstart'){
            e = e.changedTouches[0];
        }
        speedX.splice(0);
        speedY.splice(0);
        x = e.clientX;
        y = e.clientY;
        document.body.addEventListener(move,mCallback);
    });
    
    el.addEventListener(up,function(e){
        document.body.removeEventListener(move,mCallback);
        if(Date.now()-time>3){
            upFn && upFn(e);
            return;
        }
        let meanX = speedX.reduce((sum,val)=>sum+val);
        let meanY = speedY.reduce((sum,val)=>sum+val);
        sumX += meanX/3*8;
        sumY += meanY/3*8;
        animate(el,{ endClose:true },[{ transform:{ translate: [sumX,sumY] } },{ duration:300,timing:'ease' }]).then(()=>{
            upFn && upFn(e);
        });
        
    });
}