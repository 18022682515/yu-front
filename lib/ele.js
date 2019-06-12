require('./matrix.js');
require('./animate.js');

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

HTMLElement.prototype.eleAddToScriptBefore = function(child) {
    
    let div = document.createElement("div");
    let key = null;
    if(child.startsWith('#')){
        key = 'id'
    }else if(child.startsWith('.')){
        key = 'className';
    }
    key && (div[key] = child.slice(1));
    let scriptEle = this.querySelector('script');
    scriptEle && this.insertBefore(div,scriptEle);
    !scriptEle && this.appendChild(div);
    return child;
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

window.download = function(fileName){
    function getHTMLString(node) {
        let div = document.createElement('div');
        div.appendChild(node);
        let str = div.innerHTML;
        div = node = null;
        return str;  
    }
    
    let str = getHTMLString(el('html').cloneNode(true));
    let a = document.createElement('a');
    a.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(str));
    a.setAttribute('download',fileName);
    a.click();
    window.download = null;
}


module.exports = { el, $ };
