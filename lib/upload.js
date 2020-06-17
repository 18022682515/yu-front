import { getType } from 'yu-util'
import ajax from './ajax.js'

function upload(input,config,onprogress){
	
	let formData = new FormData();
	let files = Array.from(input.files); //获取所有上传文件对象

	let url = '';
	if(getType(config,'String')){
		url = config;
		config = { url };
	}
	if(!getType(config,'Object') || !config.url) return;
	
	let data = config.data || {};
	Object.keys(data).forEach(key=>{
		formData.append(key,data[key])
	})
	
	config.method = 'post';
	config.data = formData;
	config.onprogress = onprogress;
	
	files.forEach((file,i)=>{
		formData.append('files',file)
	})
	return ajax(config)
}

export default upload