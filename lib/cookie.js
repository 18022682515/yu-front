function getCookie () {
  if (!document.cookie || document.cookie.length < 1) {
    return {}
  }
  const str = document.cookie
  const cookieArr = str.split(/\;\s/)
  const o = {}
  cookieArr.forEach((val, index) => {
    const arr = val.split('=')
    o[arr[0]] = arr[1]
  })
  return o
}

const cookie = {
  set (key, value, expires) {
    expires = expires || 3600
    expires *= 1000
    document.cookie = key + '=' + value + ';expires=' + new Date(Date.now() + expires).toGMTString()
  },
	
  get (key) {
    if (key) return getCookie()[key]
    return getCookie()
  },
	
  delete (key) {
    const cookies = getCookie()
    if (!cookies.hasOwnProperty(key)) return;
		const value = cookies[key];
		document.cookie = key + '=' + value + ';expires=' + new Date(Date.now() - 1000).toGMTString()
		return true;
  },
	
  clear () {
    Object.keys(getCookie()).forEach(key => {
      this.delete(key)
    })
  }
}

export default cookie
