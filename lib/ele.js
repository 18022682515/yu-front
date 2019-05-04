const TWEEN = require('./tween.js');
const { tick, clearTick } = require('./timer.js');

function el(selector) {
    return document.querySelector(selector);
}

function $(...selector) {
    let arr = [];
    selector.forEach(val=>{
        let eles = document.querySelectorAll(val);
        arr.push(...Array.from(eles));
    });
    return arr;
}

HTMLElement.prototype.addClassName = function(...className) {
    let str = className.length>1 ? className.join(' ') : className[0];
    if(!this.className){
        this.className = str; 
        return;
    }
    this.className += ' '+str; 
}

HTMLElement.prototype.removeClassName = function(...className) {
    let arr = this.className.split(' ');
    className.forEach(val=>{
        let i = arr.indexOf(val); 
        if(i!==-1){
            arr.splice(i, 1);
        }
    });
    this.className = arr.join(' ');
}

HTMLElement.prototype.emptyClass = function() {
    this.className = '';
}

HTMLElement.prototype.ClassIsExist = function(className) {
    let arr = this.className.split(' ');
    let bool = arr.some(val=>{
        return val===className;
    });
    return bool;
}

HTMLElement.prototype.ClassIsNum = function() {
    let arr = this.className.split(' ');
    if(arr[0]=='') return;
    let bool = arr.some(val=>{
        return Number.isFinite(Number(val));
    });
    return bool;
}

HTMLElement.prototype.filterNaNClass = function() {
    let arr = this.className.split(' ');
    let filterArr = arr.filter(val=>{
        return Number.isFinite(Number(val));
    });
    this.className = filterArr.length>0 ? filterArr.join(' ') : '';
}

HTMLElement.prototype.animate = function(options, ...args) {
    return new Promise(res=>{
        let num = 0;
        let timer = null;
        let _this = this;
        let history = [];
        let len = args.length-1;
        let argsType = Object.prototype.toString;
        argsType.call(options)==='[object Array]' && (args || (args=[])) && args.unshift(options);
        
        bis(args[num]);

        function bis(arg) {
            let before = {};
            let record = {};
            Object.keys(arg[0]).forEach(key=>{
                let cssVal = getComputedStyle(_this)[key];
                let numVal = Number.isFinite(Number(cssVal)) ? Number(cssVal) : parseInt(cssVal);
                before[key] = numVal;
                record[key] = numVal;
                let target = unitType(arg[0][key], _this, key);
                arg[0][key] = target;
            });
            history.unshift([ record, arg[1] ]);
            new TWEEN.Tween(before).delay(arg[1].delay||0).to(arg[0], arg[1].duration).easing(TWEEN.Easing.Cubic.In).onUpdate((t)=>{
                Object.keys(before).forEach(key=>{
                    if(key==='opacity'){
                        _this.style[key] = before[key];
                        return;
                    }
                    _this.style[key] = before[key]+'px';
                });
            }).onComplete(()=>{
                arg[1].callback && arg[1].callback(arg);
                if(arg[1].reverse) {           
                    Number.isFinite(arg[1].reverse) && arg[1].reverse--;
                    history.length>50 && history.pop();
                    !options.reverseDelay && (history[0][1].delay = 0);
                    bis(history[0]);
                    return;
                }
                num++;
                if(num>len){
                    if(options && options.reverse){
                        args = history;
                        history = [];
                        num = 0;
                        len = args.length-1;
                        Number.isFinite(options.reverse) && options.reverse--;
                    }else{
                        clearTick(timer);
                        res(args);
                        return;
                    }
                }
                bis(args[num]);
            }).start();
        }

        (function fn(){
            if(!TWEEN.update()) return;
            timer = tick(fn);
        })();
    });
}

function unitType(val, ele, key) {
    let target = Number.isFinite(Number(val)) ? Number(val) : parseInt(val);
    if(typeof val==='string' && val.includes('%')){
        let cssVal = getComputedStyle(ele.parentNode)[key];
        let parent = parseInt(cssVal);
        let targetPx = Math.round(target/100*parent);
        return targetPx;
    }
    return target;
}

module.exports = { el, $, TWEEN };
