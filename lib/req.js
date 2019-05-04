function ajax (method,url,data) {
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

module.exports = { ajax, getCookies, examineUser };