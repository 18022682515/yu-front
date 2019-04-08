const obj = {};

obj.ajax = (method,url,data) => {
    let xhr = XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject();
    xhr.open(method, url, true);
    method=='post' && xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(data);

    return new Promise(res => {
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                res(xhr.responseText);
            }
        }
    });
}

obj.getCookies = () => {
    let str = document.cookie;
    let cookieArr = str.split('&');
    let o = {};
    cookieArr.forEach((val,index)=>{
        let arr = val.split('=');
        let key = arr[0].trim();
        let value = arr[1].trim();
        o[key] = value;
    });
    return o;
}

module.exports = Object.freeze(obj);