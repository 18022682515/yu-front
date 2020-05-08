const { getType,toJSON } = require('yu-util');

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
                    let valArr = val.replace(':','&').split('&');
                    valArr.length>1 && (headers[valArr[0]] = valArr[1].trim());
                });
                res({
                    headers,
                    data:toJSON(xhr.responseText)
                });
            }
        }
    });
}


export default ajax;