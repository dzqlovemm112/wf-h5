import md5 from 'js-md5'
import {
	Constant
} from '../utils/constant';
import { isStrEmpty } from '../utils/index';

const sort_ASCII = (obj) => {
	var arr = new Array();
	var num = 0;
	for (var i in obj) {
		arr[num] = i;
		num++;
	}
	var sortArr = arr.sort();
	var sortObj = {};
	for (var i in sortArr) {
		sortObj[sortArr[i]] = obj[sortArr[i]];
	}
	return sortObj;
};
const convertObj = (data) => {
	var _result = [];
	for (var key in data) {
		var value = data[key];
		if (Array.isArray(value)) {
			value.forEach(function(_value) {
				_result.push(key + "=" + _value);
			});
		} else {
			_result.push(key + "=" + value);
		}
	}
	return _result.join("&");
};
const randomString = () => {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid;
};
export const signRequest = (requestData) => {

	// if (uni.getStorageSync("patientId") && requestData.data) {
	// requestData.data["userId"] = wx.getStorageSync("patientId");
	Object.keys(requestData.data).map((item) => {
		if (requestData.data[item] === "") {
			delete requestData.data[item];
		}
		return true;
	});
	// }

	let _url = "";
	let sort_data;
	const client_id = Constant.client_id
	// const client_secret = process.env.NODE_ENV === 'development'?'qunqiu-demo-secret':'lyoc8izpv5e7b4d9321687059514490';
	const client_secret = Constant.client_secret
	const timestamp = new Date().valueOf();
	const nonce = randomString();
	const body = {
		body: JSON.stringify(requestData.data),
	};
	const front_data = requestData.header ? body : requestData.data;
	// if(requestData.data == "")front_data={}
	sort_data = sort_ASCII({
		...front_data,
		...{
			client_id
		},
		...{
			timestamp
		},
		...{
			nonce
		}
	})
	const stringUrl = convertObj(sort_data);
	const sign = md5(`${stringUrl}${client_secret}`);
	_url = `${requestData.url}?sign=${sign}&client_id=${client_id}&timestamp=${timestamp}&nonce=${nonce}`;
	if (requestData.method === "DELETE" || (requestData.method === "PUT" && !requestData.header)) {
		_url = `${_url}&${convertObj(requestData.data)}`;
	}
	requestData._url = _url
	return requestData;
}


//进入应用的时候，惊喜签名判断
export const signRequestWithIntoApp = (requestData) => {

	// if (uni.getStorageSync("patientId") && requestData.data) {
	// requestData.data["userId"] = wx.getStorageSync("patientId");
	if (requestData.params) {
		Object.keys(requestData.params).map((item) => {
			let tmp = requestData.params[item] + ''
			if (isStrEmpty(tmp) || tmp?.trim() == '') {
				delete requestData.params[item];
			}
			return true;
		});
	}

	// }

	let _url = "";
	let sort_data;
	const client_id = Constant.client_id
	// const client_secret = process.env.NODE_ENV === 'development'?'qunqiu-demo-secret':'lyoc8izpv5e7b4d9321687059514490';
	const client_secret = Constant.client_secret
	const timestamp = new Date().valueOf();
	const nonce = randomString();

	const body = requestData.params == undefined || JSON.stringify(requestData.params) == '{}'
		? ''
		: {
			body: JSON.stringify(requestData.params),
		};
	const front_data = (requestData.method === 'GET' || requestData.header != undefined) ? requestData.params : body;
	// if(requestData.data == "")front_data={}

	sort_data = sort_ASCII({
		...front_data,
	})
	const stringUrl = convertObj(sort_data);
	const sign = md5(`${stringUrl}${client_secret}`);
	console.log('mysign:', sign)
	return sign;
}