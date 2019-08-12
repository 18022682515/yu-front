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
declare function animate(ele:any, options?:Object, ...args:Object[][]):Promise<any[]>;
declare function el(selector:string):any;
declare function $(...args:string[]):any[];
declare function ajax(method:string, url:string, data:Object, header:Object): Promise<Object>;

declare function getCookies():Object;
declare function tick(callback:()=>void):number;
declare function clearTick(timer:number):void;
declare function examineUser(str:string, count?:number):boolean;
declare function shape(element:any,options:Object,...args:Object[]):void;
declare function getSite(ele:any):Object;

export { animate, shape, el, $, ajax, getCookies, tick, clearTick, examineUser };