const { getType } = require('yu-util');
let obj = {};
obj.getRotate = function(deg){
    let [ a,b,c,d,e,f,g,h,i ] = [ 1,0,0,1,0,0,0,0,1 ];
    let radian = Math.PI/180*deg;
    a = Math.cos(radian);
    b = Math.sin(radian);
    c = -Math.sin(radian);
    d = Math.cos(radian);
    return [ a,b,c,d,e,f,g,h,i ];
}
obj.getScale = function(x,y){
    let [ a,b,c,d,e,f,g,h,i ] = [ 1,0,0,1,0,0,0,0,1 ];
    return [ a*x, b, c, d*y, e, f, g, h, i ];
}

obj.getTranslate = function(x,y){
    let [ a,b,c,d,e,f,g,h,i ] = [ 1,0,0,1,0,0,0,0,1 ];
    e = x;
    f = y;
    return [ a,b,c,d,e,f,g,h,i ];
}

obj.getSkew = function(x,y){
    let [ a,b,c,d,e,f,g,h,i ] = [ 1,0,0,1,0,0,0,0,1 ];
    let radianX = Math.PI/180*x;
    let radianY = Math.PI/180*y;
    b = Math.tan(radianY);
    c = Math.tan(radianX);
    return [ a,b,c,d,e,f,g,h,i ];
}

function merge(m1,m2){
    let [ a,b,c,d,e,f,g,h,i ] = m1;
    let [ A,B,C,D,E,F,G,H,I ] = m2;
    let a1 = a*A+c*B+e*G;
    let b1 = b*A+d*B+f*G;
    let c1 = a*C+c*D+e*H;
    let d1 = b*C+d*D+f*H;
    let e1 = a*E+c*F+e*I;
    let f1 = b*E+d*F+f*I;
    let g1 = g*A+g*B+g*G;
    let h1 = g*C+h*D+i*H;
    let i1 = g*E+h*F+i*I;
    return [ a1,b1,c1,d1,e1,f1,g1,h1,i1 ];
}
exports.getMatrix = function(transform){
    let all = [];
    for(let attr in transform){
        let first = attr[0].toLocaleUpperCase();
        let fn = obj['get'+first+attr.slice(1)];
        let arr = getType(transform[attr])!=='Array' ? [ transform[attr] ] :transform[attr];
        transform[attr] && fn && all.push( fn(...arr) );
    }
    let res = all.reduce((a,b)=>{
        let res = merge(a,b);
        return res
    });
    res.splice(-3);
    return `matrix(${res.join(',')})`;
}