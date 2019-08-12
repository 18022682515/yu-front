import { getType } from 'yu-util';

export function shape(ele,options,...args){
    options = getType(options)==='Object' ? options: {}; 
    if(options.d){
        args.unshift(options);
        options = {};
    }

    options.reverse = options.reverse || 1;
    args.forEach(path=>{
        path.duration = path.duration || 600;
        path.delay = path.delay || 500;
        path.timing = path.timing || 'ease-in-out';
    });
    

    let paths = [];
    args.forEach(path=>{
        let d = dToArr(path.d);
        paths.push(d);
    });
    paths = comparison(paths);
    runAni(ele,options,paths,args);
}

function runAni(ele,options,paths,args){
    paths.forEach((path,i)=>{
        let nPath = path.map(arr=>{
            return arr.join(' ');
        });
        args[i].d = nPath.join(' ')+' Z';
    });
    //将path的d属性转成字符串格式：'M10 10 L20 20……'

    let n = 0;
    (function fn(){
        let path = args[n++];
        ele.style.transition = `all ${path.duration/1000}s ${path.timing} ${path.delay/1000}s`;
        ele.setAttribute('d',path.d);
        setTimeout(()=>{
            if(n>args.length-1){
                getType(options.reverse)==='Number' && options.reverse--;
                n = 0;
            }
            options.reverse && fn();
        },path.duration+path.delay);
    })();
}

function comparison(paths){
    paths.sort((a,b)=>{

        for(let i=1; i<b.length; i++){
            let firstB = b[i][0];
            let firstA = a[i] && a[i][0];
            if(firstA===firstB) continue;

            let xi = i;
            let x = null;
            while(!x){
                let xLast = a[--xi];
                let index = xLast.length-2;
                if(index>0){
                    x = xLast[index];
                }else if(/H/i.test(xLast[0])){
                    x = xLast[1];
                }
            }
            let yi = i;
            let y = null;
            while(!y){
                let yLast = a[--yi];
                let index = yLast.length-1;
                if(index>1 || /V/i.test(yLast[0])){
                    y = yLast[index];
                }
            }
            let arr = [...b[i]];
            if(/[a-y]/.test(arr[0])){
                arr = arr.map((val,j)=>{
                    if(j==0) return val;
                    return '0';
                });
            }else if(/[A-Y]/.test(arr[0])){
                arr = arr.map((val,j)=>{
                    if(j==0) return val;

                    if(arr[0].includes('V')){
                        return y;
                    }
                    if(j%2===1){
                        return x;
                    }else{
                        return y;
                    }
                });
            }
            a.splice(i,0,arr);
        }

        for(let i=1; i<a.length; i++){
            let firstA = a[i][0];
            let firstB = b[i] && b[i][0];
            if(firstA===firstB) continue;

            let xi = i;
            let x = null;
            while(!x){
                let xLast = b[--xi];
                let index = xLast.length-2;
                if(index>0){
                    x = xLast[index];
                }else if(/H/i.test(xLast[0])){
                    x = xLast[1];
                }
            }
            let yi = i;
            let y = null;
            while(!y){
                let yLast = b[--yi];
                let index = yLast.length-1;
                if(index>1 || /V/i.test(yLast[0])){
                    y = yLast[index];
                }
            }
            let arr = [...a[i]];
            if(/[a-y]/.test(arr[0])){
                arr = arr.map((val,j)=>{
                    if(j==0) return val;
                    return '0';
                });
            }else if(/[A-Y]/.test(arr[0])){
                arr = arr.map((val,j)=>{
                    if(j==0) return val;

                    if(arr[0].includes('V')){
                        return y;
                    }
                    if(j%2===1){
                        
                        return x;
                    }else{
                        return y;
                    }
                });
            }
            b.splice(i,0,arr);
        }
        
    });

    if(paths[0].length!==paths[paths.length-1].length) comparison(paths);
    return paths;
}

function dToArr(d){
    let str = d.replace(/([A-z])/g,'=$1,').slice(1);
    let arr = str.split('=');
    arr = arr.map(val=>{
        let nVal = val.replace(/(-)/g,',$1');
        return nVal.split(/,|\s/g).filter(v=>{
            return v.length>0;
        });
    });
    return arr.filter(val=>{
        return !/Z/i.test(val);//!val.includes('Z');
    });
    //返回这样的数组：[['M,11,11'], ['L,55,55'],['C,66','66','66','66','66','66']];
}
