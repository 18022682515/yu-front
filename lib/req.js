const { getType } = require('yu-util');
function ajax (method,url,data,header) {
    method = method.toLocaleLowerCase();
    let xhr = XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject();
    
    if(data){
        if(getType(data)==='Object'){
            let arr = [];
            Object.keys(data).forEach(key=>{
                arr.push(key+'='+data[key]);
            });
            data = arr.join('&');
        }else if(getType(data)==='String'){
            data = data.replace(/^\?/,'');
        }else{
            return;
        }
        url = url.replace(/\?$/,'');
        data.length>0 && method==='get' && (url += '?'+data);
    }
    
    xhr.open(method, url, true);
    if(header && getType(header)==='Object'){
        Object.keys(header).forEach(key=>{
            xhr.setRequestHeader(key,header[key]);
        });
    }
    method=='post' && xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(data);

    return new Promise(res => {
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                let str = xhr.getAllResponseHeaders();
                let arr = str.split('\n');
                let headers = {}
                arr.forEach(val=>{
                    if(val==='') return;
                    let valArr = val.replace(':','&').split('&');
                    headers[valArr[0]] = valArr[1].trim();
                });
                res({
                    headers,
                    data:getJSON(xhr.responseText)
                });
            }
        }
    });
}

function getJSON(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return str;
    }
}

function getCookies(){
    let str = document.cookie;
    let cookieArr = str.split(';');
    let o = {};
    cookieArr.forEach((val,index)=>{
        let arr = val.split('=');
        let key = arr[0].trim();
        let value = arr[1].trim();
        o[key] = value;
    });
    return o;
}

function examineUser(str, count=6) {
    let re1 = new RegExp('^\\w{'+count+',32}$');
    let re2 = /^[0-9]*$/;
    let bool1 = re1.test(str);
    let bool2 = re2.test(str);
    if(bool2) return false;
    return bool1;
}

module.exports = { ajax, getCookies, getJSON, examineUser };