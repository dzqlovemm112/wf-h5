import http from './request'

/*  获取微信用户的手机号和openid */
export const getwechatTelAndCode = (params?: any) => {
	return http.post('api-cas/doctor/weapp/login', params)
}

/*  获取医生信息  */
export const getDoctorByPhone = (phone: string) => {
	return http.get('api-doctor/doctor/doctor-base/getDoctorByPhone', {
		phone
	})
}
