const TWEEN = require('./tween.js');
const { tick, clearTick } = require('./timer.js');

function getType(v) {
    let str = Object.prototype.toString.call(v);
    return str.replace(/\[object\s(.+)\]/,'$1');
}

HTMLElement.prototype.setTransform = function (transform){
    let matrixs = [];
    Object.keys(transform).forEach(key=>{
        let matrixStr = getMatrixStr(key, transform[key], this);
        let matrix = getMatrix(matrixStr);
        matrixs.push(matrix);
    });
    
    let result = countMatrixs(matrixs);
    let [[a,c,e],[b,d,f],[i,j,k]] = result;
    // return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    return { a, b, c, d, e, f };
}


HTMLElement.prototype.aniMatrix = function(options, ...args) {
    return new Promise(res=>{
        let num = 0;
        let timer = null;
        let _this = this;
        let history = [];
        getType(options)==='Array' && (args || (args=[])) && args.unshift(options);
        let len = args.length-1;
        args.forEach((arg,i)=>{
            args[i][0] = _this.setTransform(arg[0]);
        });
        
        bis(args[num]);

        function bis(arg) {
            let init = getComputedStyle(_this).transform;
            init == 'none' && (init='matrix(1,0,0,1,0,0)');
            let [[ a, c, e ], [ b, d, f ]] = getMatrix(init);
            let before = { a, b, c, d, e, f };
            let record = { ...before };
            arg[1] = arg[1] || {};
            history.unshift([ record, arg[1] ]);
            new TWEEN.Tween(before)
                .delay(arg[1]
                .delay||0)
                .to(arg[0], arg[1].duration||600)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onUpdate((t)=>{
                    let { a, b, c, d, e, f } = before;
                    _this.style.transform = `matrix(${a},${b},${c},${d},${e},${f})`;
                })
                .onComplete(()=>{
                    if(arg[1].reverse) {           
                        Number.isFinite(arg[1].reverse) && arg[1].reverse--;
                        history.length>50 && history.pop();
                        !options.reverseDelay && (history[0][1].delay = 0);
                        bis(history[0]);
                        return;
                    }
                    num++;
                    if(num>len){
                        if(getType(options)==='Object' && options.reverse){
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
                })
                .start();
        }

        (function fn(){
            if(!TWEEN.update()) return;
            timer = tick(fn);
        })();
    });
}

function countMatrixs(matrixs) {
    
    let result = matrixs.reduce((front,back)=>{
        let sum = [[],[],[]];
        for(let j=0; j<back.length; j++){
            front.forEach((arr,k)=>{
                let num = 0;
                arr.forEach((val,i)=>{
                    num += val*back[i][j];
                });
                sum[k].push(parseFloat(num.toFixed(3)));
            });
        }
        return sum;
    });
    return result;
}

function getMatrixStr(key,val,ele) {
    let matrixStr = '';
    let str = key.replace(/(X|Y)$/,'');
    str ==='translate' && (matrixStr = setTranslate(key,val,ele));
    str ==='rotate' && (matrixStr = setRotate(val));
    str ==='scale' && (matrixStr = setScale(key,val));
    str ==='skew' && (matrixStr = setSkew(key,val));
    return matrixStr;
}
function setSkew(key,val) {
    let x = 0, y = 0;
    let type = getType(val);
    if(type==='Array'){
        val.forEach((v,i)=>{
            let num = parseFloat(v);
            let radian = Math.PI/180*num;
            let tan = (Math.tan(radian)).toFixed(3);
            i===0 ? (x=tan) : (y=tan);
        });
    }else{
        let num = parseFloat(val);
        let radian = Math.PI/180*num;
        let tan = (Math.tan(radian)).toFixed(3);
        key==='skewX' ? (x=tan) : (y=tan);
    }
    return `matrix(1, ${y}, ${x}, 1, 0, 0)`;
}

function setScale(key, val) {
    let type = getType(val);
    let x = 1, y = 1;
    if(type==='Array'){
        x = parseFloat(val[0]);
        y = parseFloat(val[1]);
    }else{
        val = parseFloat(val);
        key==='scaleX' ? (x = val) : (y = val);
    }
    return `matrix(${x}, 0, 0, ${y}, 0, 0)`;
}

function setRotate(val) {
    let num = parseFloat(val);
    let radian = Math.PI/180*num; // 算出弧度
    let sin = (Math.sin(radian)).toFixed(3) // 计算 sinθ
    let cos = (Math.cos(radian)).toFixed(3) // 计算 cosθ
    return `matrix(${cos}, ${sin}, -${sin}, ${cos}, 0, 0)`;
}

function setTranslate(key,val,ele) {
    let x = 0, y =0;
    let type = getType(val);
    if(type==='Array'){
        val.forEach((v,i)=>{
            let num = parseFloat(v);
            if(getType(v)=='String' && v.includes("%")){
                let attr = i==0 ? 'width' : 'height';
                let cssVal = getComputedStyle(ele)[attr];
                num = Math.round(num/100*parseFloat(cssVal));
            }
            i==0 ? (x=num) : (y=num);
        });
    }else{
        if(getType(val)=='String' && val.includes("%")){
            let attr = key==="translateX" ? 'width' : 'height';
            let cssVal = getComputedStyle(ele)[attr];
            val = Math.round(parseFloat(val)/100*parseFloat(cssVal));
        }else{
            val = parseFloat(val);
        }
        key==="translateX" ? (x = val) : (y = val);
    } 
    return `matrix(1, 0, 0, 1, ${x}, ${y})`;
}

function getMatrix(str) {
    let filterStr = str.replace(/^matrix\((.+)\)$/,'$1');
    let vals = filterStr.split(',');
    let keys = ['a','b','c','d','e','f'];
    let obj = {};
    vals.forEach((val,i)=>{
        obj[keys[i]] = parseFloat(val);
    });

    let { a,b,c,d,e,f } = obj;
    return [
        [ a, c, e ],
        [ b, d, f ],
        [ 0, 0, 1 ]
    ];
}
