
function getType(v) {
    let str = Object.prototype.toString.call(v);
    return str.replace(/\[object\s(.+)\]/,'$1');
}

function getTransform(obj){
    let result = [];
    Object.keys(obj).forEach(key=>{
        let filter = key.replace(/(X|Y|Z|3d)$/,'');
        if(getType(obj[key])==='Array'){
            
            let arr = [];
            obj[key].forEach((v,i)=>{
                if( Number.isFinite(Number(v)) ){
                    filter==='translate' && (v = v+'px');
                    filter==='rotate' && (v = v+'deg');
                    filter==='skew' && (v = v+'deg');
                }
                arr.push(v);
            });
            result.push(`${key}(${arr.join(',')})`);
        }else{
            let v = obj[key];
            if( Number.isFinite(Number(v)) ){
                filter==='translate' && (v = v+'px');
                filter==='rotate' && (v = v+'deg');
                filter==='skew' && (v = v+'deg');
            }
            result.push(`${key}(${v})`);
        }
    });
    return result.join(' ');
}

function getCss(obj) {
    let result = {};
    Object.keys(obj).forEach(key=>{
        let val = obj[key];

        if(key==='transform'){
            getType(val)==='Object' && (result[key] = getTransform(val));
            getType(val)==='String' && (result[key] = val);
            return;
        }

        if(key==='opacity' || key==='zIndex'){
            result[key] = parseFloat(val);
            return;
        }
        
        if(getType(val)==='Array'){
            let arr = [];
            val.forEach(v=>{
                Number.isFinite(Number(v)) && (v = v+'px');
                arr.push(v);
            });
            result[key] = arr.join(' ');
        }else{
            Number.isFinite(Number(val)) && (val = val+'px')
            result[key] = val;
        }
    });
    return result;
}

HTMLElement.prototype.animate = function(options, ...args) {
    return new Promise(res=>{
        let num = 0;
        let record = [];
        let _this = this;
        getType(options)==='Array' && (args || (args=[])) && args.unshift(options);
        let len = args.length-1;

        let keys = [];
        let br = ['Moz','O','ms','webkit'];
        args.forEach(arg=>{
            arg[1] = arg[1] || {};
            arg[1].duration = arg[1].duration || 500;
            arg[1].timing = arg[1].timing || 'ease-out';
            arg[1].delay = arg[1].delay || 0;
            arg[0] = getCss(arg[0]);
            Object.keys(arg[0]).forEach(key=>{
                let uppercase = key.slice(0, 1).toUpperCase() + key.slice(1);
                if(_this.style[key]===undefined){
                    br.forEach(val=>{
                        _this.style[val+uppercase]!==undefined && (key = val+uppercase);
                    });
                } 
                keys.push(key);
            });           
        });

        keys = [...new Set(keys)];
        
        let o = {};
        keys.forEach(key=>{
            if(key.includes('transform')){
                o[key] = this.style[key] || 'none';
                return;
            }
            let val = getComputedStyle(this)[key];
            o[key] = val;
        });

        let tran = 'transition';
        if(_this.style[tran]===undefined){
            br.forEach(val=>{
                _this.style[val+'Transition']!==undefined && (tran = val+'Transition');
            });
        }
        run(args[num]);

        function run(arg) {
            let { duration, timing, delay } = arg[1];
            record.unshift([{...o}, arg[1]]);
            Object.assign(o,arg[0]);
            
            _this.style[tran] = `all ${duration/1000}s ${timing} ${delay/1000}s`;
            Object.keys(arg[0]).forEach(key=>{
                _this.style[key] = arg[0][key];  
            });

            setTimeout(()=>{
                if(arg[1].reverse){
                    Number.isFinite(arg[1].reverse) && arg[1].reverse--;
                    run(record[0]);
                    return;
                }
                num++;
                if(num>len){
                    if(getType(options)==='Object' && options.reverse){
                        if(getType(options)!=='Object' || !options.reverseDelay){
                            record.forEach(arr=>{
                                arr[1].delay = 0;
                            });
                        }
                        args = record;
                        len = args.length-1;
                        record = [];
                        num = 0;
                        Number.isFinite(options.reverse) && options.reverse--; 
                    }else{
                        _this.style[tran] = '';
                        res(record);
                        return;
                    }
                };
                
                run(args[num]);
            },duration+delay);
        }
    });
}
