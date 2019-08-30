declare class Ani implements Object{
    start():void;
    stop():void;
    psuse():void;
    resume():void;
}
declare class Element{
    speedAni(speed:{ x:number|string, y:number|string },max:{ x:number|string, y:number|string }):Ani;
    addClassName(...className:string[]):void;
    removeClassName(...className:string[]):void;
    emptyClass():void;
    ClassIsExist(className:string):boolean;
    ClassIsNum():boolean;
    filterNaNClass():void;
    eleAddToScriptBefore(selector:string):void;
}

declare function el(selector:string):any;
declare function $(...args:string[]):any[];
declare function getSite(ele:any):Object;
declare function animate(ele:any, options?:Object, ...args:Object[][]):Promise<any[]>;
declare function shape(element:any,options:Object,...args:Object[]):void;
declare function ajax(method:string, url:string, data:Object, header:Object): Promise<Object>;
declare function getCookies():Object;
declare function examineUser(str:string, count?:number):boolean;
declare function tick(callback:()=>void):number;
declare function clearTick(timer:number):void;
declare function getMatrix(transform:Object):string;
declare function inertia(obj:Object):void;
declare function ease(speed:Object, init:Object, num:Number, callback:Function):Promise<Object>;
declare function rate(speed:Object, init:Object, max:Object, callback:Function):Promise<Object>;

export { 
    el, 
    $,
    getSite,
    animate,
    shape,
    ajax, 
    getCookies, 
    examineUser,
    tick,
    clearTick,
    getMatrix,
    inertia,
    ease,
    rate
};