import { signRequestWithIntoApp } from "../api/sign";

export const isStrEmpty = (str: string) => {
	if (
		str === undefined ||
		str == null ||
		str === "" ||
		str === "null" ||
		str === "undefined"
	) {
		return true;
	}
	return false;
}

/**
 * toast
 */
export const showToast = (title = '', param = {}) => {
	if (!title) return;
	uni.showToast({
		title,
		duration: param.duration || 1500,
		mask: param.mask || false,
		icon: param.icon || 'none'
	});
}

/**
 * showLoading
 */
export const showLoading = (title = '', param = {}) => {
	if (!title) title = '加载中...';
	uni.showLoading({
		title
	})
}
/**
 * hideLoading
 */
export const hideLoading = (title = '', param = {}) => {
	uni.hideLoading()
}
/**
 * showLoading  and  hide
 */
export const showLoadingAndHide = (title = '', time = 1500) => {
	if (!title) title = '加载中...';
	uni.showLoading({
		title
	})
	setTimeout(() => {
		uni.hideLoading()
	}, time)
}


/**
 * 检查签名是否一致
 */
export const checkSign = (obj) => {
	const orgSign = obj?.sign

	let data = { ...obj };
	delete data.sign
	delete data.source
	delete data.state
	delete data.auth_code

	console.log('签名参数校验：', data);
	console.log('orgSign:', orgSign);
	const options = {
		url: '',
		method: 'GET',
		params: data,
	}
	const mySign = signRequestWithIntoApp(options)
	return orgSign == mySign
}

/**
 * 进入界面给url 添加时间cuo;hash 模式还未做
 */
export const addRandtime = (isHash) => {
	return new Promise((resolve, reject) => {
		const urlStr = window.location.href;
		const url = new URL(urlStr);
		if (isHash) {
			if (urlStr.indexOf('randtime') == -1) {
				if (window.location.hash == '#/') {// http://www.baidu.com/alipay/?name=aaa&age=1#/
					const params = new URLSearchParams(url.search);
					params.append('randtime', new Date().valueOf());
					url.search = params;
					window.location.replace(url.href)
				} else {// http://www.baidu.com/alipay/#/?xx=1 

					if (window.location.hash.indexOf('?') == -1) {
						window.location.href = url.href + '?randtime=' + new Date().valueOf()
					} else {
						window.location.href = url.href + '&randtime=' + new Date().valueOf()
					}
					window.location.reload()
				}
				reject(0)
			} else {
				resolve(1)
			}
		} else {
			// http://www.baidu.com/alipay?xx=1
			if (urlStr.indexOf('randtime') == -1) {
				// 创建新的 URLSearchParams 对象并将其附加到 URL 上
				const params = new URLSearchParams(url.search);
				params.append('randtime', new Date().valueOf());
				url.search = params;
				window.location.replace(url.href)
				reject(0)
			} else {
				resolve(1)
			}
		}
	})
}

/**
* 获取url参数 （支持复杂url）
* queryParams('https://www.baidu.com?a=1');               // => {a:1}
* queryParams('https://www.baidu.com/#/detail?a=1');      // => {a:1}
* queryParams('https://www.baidu.com/?a=1#/detail');      // => {a:1}
* queryParams('https://www.baidu.com/?a=1#/detail?b=2');  // => {a:1,b:2}
*/

export const queryParams = (href = window.location.href): Record<string, string> => {
	const reg = /([^&=]+)=([\w\W]*?)(&|$|#)/g
	const { search, hash } = new URL(href);
	const args = [search, hash];
	let obj = {};
	for (let i = 0; i < args.length; i++) {
		const str = args[i];
		if (str) {
			const s = str.replace(/#|\//g, '')
			const arr = s.split('?')
			if (arr.length > 1) {
				for (let i = 1; i < arr.length; i++) {
					let res;
					while ((res = reg.exec(arr[i]))) {
						obj[res[1]] = res[2]
					}
				}
			}
		}
	}
	return obj;
}

// 对象数组去重，根据key值
export const uniqueArray = (arr: any[], key: string) => {
	return arr.filter((item, index, self) =>
		self.findIndex((t) => t[key] === item[key]) === index
	);
}

// 时间补0
export const fix0 = (value: number) => {
	return value >= 10 ? value : '0' + value;
}



// 对象转url参数  {a: 1, b: 2} => a=1&b=2
export const stringifyParams = (obj: any = {}) => {
	return Object.entries(obj)
		.filter(([, v]) => ![undefined, null, '', 'null', 'undefined'].includes(v))
		.map(([k, v]) => `${k}=${v}`)
		.join('&')
}

export const goBack = () => {
	uni.navigateBack()
}