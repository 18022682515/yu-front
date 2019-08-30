const { tick } = require('./timer.js');

function run(speed,init,num,callback,ani){
    
    (function fn(){
        let keys = Object.keys(init);
        let count = 0;
        keys.forEach(key=>{
            speed[key] *= num;
            init[key] += speed[key];
            if(speed[key]<0.1){
                count++;
            }
        });
        callback && callback(init);
        if(!ani.status || count>=keys.length) return;
        tick(fn);
    })();
}

exports.ease = function(speed,init,num,callback){

    return new Promise(res=>{
        let ani = new Proxy({ status:true },{
            set(target,attr,val,receiver){
                let bool = target[attr]!==val;
                let res = Reflect.set(target, attr, val);
                bool && val && run(speed,init,num,callback,target);
                return res;
            }
        });
        res(ani);
        run(speed,init,num,callback,ani);
    });
}