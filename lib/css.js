const { getType } = require('yu-util');

exports.css = function(ele,styles){
    if( !/String|Object/.test(getType(styles)) ) return;

    const prefixs = [ "webkit","ms","moz","o" ];
    if(getType(styles)==="String"){
        if(ele.style[styles]!==undefined){
            return getComputedStyle(ele)[styles];
        }else{
            let nStyles = styles[0].toLocaleUpperCase()+styles.slice(1);
            let str = "";
            prefixs.forEach(prefix=>{
                if(ele.style[prefix+nStyles]!==undefined){
                    str = getComputedStyle(ele)[prefix+nStyles];
                }
            });
            return str;
        }
    }
    Object.keys(styles).forEach(key=>{
        if(ele.style[key]!==undefined){
            ele.style[key] = styles[key];
        }else{
            let nkey = key[0].toLocaleUpperCase()+key.slice(1);
            prefixs.forEach(prefix=>{
                if(ele.style[prefix+nkey]!==undefined){
                    ele.style[prefix+nkey] = styles[key];
                }
            });
        }
    });
}