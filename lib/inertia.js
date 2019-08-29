const { tick } = require('./timer.js');

let element = null, 
t = "", 
x = 0, 
y = 0, 
xSpeeds = [], 
ySpeeds = [], 
bool = false,
last = 0,
tmove = null;
const transform = new Proxy(
    { },
    {
        set(target,attr,val,receiver){
            element.style.transform = '';
            for(let key in receiver){
                element.style.transform += ` ${key}(${receiver[key]}px)`;
            }
            return Reflect.set(target, attr, val);
        }
    }
);

function move(e){
    tmove && tmove(e);
    let mx = e.changedTouches[0].clientX;
    let my = e.changedTouches[0].clientY;
    let valX = mx-x;
    let valY = my-y;
    if( xSpeeds.length>0 && ((xSpeeds[0]>0 && valX<0) || (xSpeeds[0]<0 && valX>0)) ){
        xSpeeds.splice(0);
    }
    if( ySpeeds.length>0 && ((ySpeeds[0]>0 && valY<0) || (ySpeeds[0]<0 && valY>0)) ){
        ySpeeds.splice(0);
    }
    xSpeeds.push(valX);
    ySpeeds.push(valY);
    /\*|x/.test(t) && (transform.translateX = (transform.translateX||0)+valX);
    /\*|y/.test(t) && (transform.translateY = (transform.translateY||0)+valY);
    x = mx;
    y = my;
    last = Date.now();
}

function ani(){
    return new Promise(res=>{
        let timeVal = Date.now()-last;
        if(timeVal>5 || xSpeeds.length<1 || ySpeeds.length<1){
            res();
            return;
        }
        bool = false;
        let xSpeed = xSpeeds.reduce((sum,val)=>sum+val)/xSpeeds.length;
        let ySpeed = ySpeeds.reduce((sum,val)=>sum+val)/ySpeeds.length;
        (function fn(){
            xSpeed *= 0.95;
            Math.abs(xSpeed)>0.1 && (transform.translateX += xSpeed);
            ySpeed *= 0.95;
            Math.abs(ySpeed)>0.1 && (transform.translateY += ySpeed);
            if(bool || (Math.abs(xSpeed)<=0.1 && Math.abs(ySpeed)<=0.1)){
                res();
                return;
            }
            tick(fn);
        })();
    });
    
}

exports.inertia = function(obj){
    let { ele, type, touchstart, touchend, touchmove, complete } = obj;
    element = ele, t = type||"*", tmove = touchmove;
    ele.addEventListener('touchstart',e=>{
        touchstart && touchstart(e);
        bool = true;
        xSpeeds.splice(0);
        ySpeeds.splice(0);
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
        document.body.addEventListener('touchmove',move);
    });
    ele.addEventListener('touchend',e=>{
        touchend && touchend(e);
        document.body.removeEventListener('touchmove',move);
        ani().then(()=>{
            complete && complete();
        })
    });
}

