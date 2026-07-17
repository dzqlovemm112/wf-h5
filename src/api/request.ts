const BASE_URL = '' //api 地址
import {
	authTool
} from '../components/dzq-auth/authTool';
import {
	Constant
} from '../utils/constant';
import {
	signRequest
} from './sign'


let toast = function (title) {
	// uni.$u.toast(text)
	uni.showToast({
		title,
		icon: 'none'
	});
}
const request = (options = {}) => {
	let BASE_URL = '/api/'

	// #ifdef MP
	BASE_URL = Constant.baseUrl + '/api/'
	// #endif

	options.url = `${BASE_URL}${options._url}`
	console.log('request-options:', options);
	// 请求前可以判断一下网络，可以加一个toast

	const userInfo = authTool.getUserInfo()
	const token = userInfo?.access_token

	return new Promise((resolve, reject) => {
		uni.request({
			url: options.url,
			method: options.method,
			data: options.data,
			header: {
				...{
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: "bearer " + token
				},
				...options.header,
			},
			success: (res) => {
				if (res.statusCode == 200) {
					if (res.data.code == 200 && res.data.data) {
						resolve(res.data);
					} else {
						resolve(res.data);
					}
				} else {
					if (res.statusCode == 401) {
						authTool.delUserInfo({})
						uni.redirectTo({
							url: '/pages/user/login'
						})
					}
					if (res && res.data.message) {
						toast(res.data.message)
					} else {
						toast('服务内部错误')
					}
					reject(res)
				}
			},
			fail: (err) => {
				console.log('request-fail:', err);
				reject(err)
			},
			complete: () => {

			},
		});
	})

}

const get = (url: string, data: any = {}, header: any = {}) => {
	const options = {
		url: url,
		method: 'GET',
		data: data,
		header
	}
	return request(signRequest(options))
}
const post = (url: string, data: any = {}, header: any = {}) => {
	const options = {
		url: url,
		method: 'POST',
		data: data,
		header
	}
	return request(signRequest(options))
}

export default {
	request,
	get,
	post
}