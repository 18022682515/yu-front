const { tick } = require('./timer.js');

function run(speed,init,max,callback,ani){
    (function fn(){
        let count = 0;
        let keys = Object.keys(init);
        keys.forEach(key=>{
            init[key] += speed[key];

            if(init[key]<max[key]) return;
            init[key] = max[key];
            count++;
        });
        
        callback && callback(init);
        if(!ani.status || count>=keys.length) return;
        tick(fn);
    })();
}
exports.rate = function(speed,init,max,callback){
    return new Promise(res=>{
        let ani = new Proxy({ status:true },{
            set(target,attr,val,receiver){
                let bool = target[attr]!==val;
                let res = Reflect.set(target, attr, val);
                bool && val && run(speed,init,max,callback,target);
                return res;
            }
        });
        res(ani);
        run(speed,init,max,callback,ani);
    });
}