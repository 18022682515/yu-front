import { getType,toJSON } from 'yu-util'

function ajax (options) {
	let method = options.method || 'get';
	let url = options.url || '';
	let data = options.data;
	let header = options.header;
	let type = options.type || '';
	let onprogress = options.onprogress;
	let formData = new FormData();
	
	if(/get|delete/i.test(method)){
		//如果是get或delete请求，将数据转成'url?id=1&name=xxx'
		if(getType(data,'Object') && Object.keys(data).length>0){
			let arr = Object.keys(data).map(key=>{
				return key+'='+data[key]
			})
			url = url+'?'+arr.join('&');
		}else if(getType(data,'String') && data.length>0){
			data = data.replace(/^\?/,'')
			url = url+'?'+data
		}
	}else{
		//如果是post|put请求，将数据存到formData中
		if(getType(data,'FormData')){
			formData = data;
		}else if(getType(data,'Object')){
			Object.keys(data).forEach(key=>{
				formData.append(key,data[key]);
			})
		}else if(getType(data,'String')){
			data = data.replace(/^\?/,'')
			data.split('&').forEach(val=>{
				let arr = val.split('=');
				formData.append(arr[0],arr[1])
			})
		}
	}

	let xhr = XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject();
  xhr.responseType = type;
	
	return new Promise(res => {
		getType(onprogress,'Function') && (xhr.upload.onprogress = onprogress);
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4 && xhr.status==200){
				//将响应headers解析成对象
				let str = xhr.getAllResponseHeaders();
				let arr = str.split('\n');
				let headers = {}
				arr.forEach(val=>{
					let valArr = val.replace(':','&').split('&');
					valArr.length>1 && (headers[valArr[0]] = valArr[1].trim());
				});
				xhr.headers = headers;
				xhr.data = toJSON(xhr.response)
				res(xhr);
			}
		}
		xhr.open(method, url, true);
		if(getType(header,'Object')){
			Object.keys(header).forEach(key=>{
				xhr.setRequestHeader(key,header[key]);
			});
		}
		/get|delete/i.test(method)? xhr.send(null): xhr.send(formData);
  });
}


export default ajax;