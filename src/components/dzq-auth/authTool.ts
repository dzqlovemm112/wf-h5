export const authTool = {
	delUserInfo: function() {
		uni.removeStorage({
			key: 'userinfo',
		})
	},
	setUserInfo: function(userInfo) {
		uni.setStorage({
			key: 'userinfo',
			data: JSON.stringify(userInfo)
		})
	},
	getUserInfo: function() {
		try {
			const value = uni.getStorageSync('userinfo')

			if (value) {
				return JSON.parse(value)
			} else {
				return undefined
			}
		} catch (e) {
			//TODO handle the exception
		}

	},
	setUserId: function(id) {
		uni.setStorage({
			key: 'userid',
			data: id
		})
	},
	getUserId: function() {
		try {
			const value = uni.getStorageSync('userid')

			if (value) {
				return value
			} else {
				return undefined
			}
		} catch (e) {
			//TODO handle the exception
		}

	},
	setToken: function(token) {
		uni.setStorage({
			key: 'token',
			data: token
		})
	},
	getToken: function() {
		try {
			const value = uni.getStorageSync('token')
			if (value) {
				return value
			} else {
				return undefined
			}
		} catch (e) {
			//TODO handle the exception
		}
	}

}
export const isLogin = () => {
	console.log('是否已经登录', authTool.getUserInfo());
	return authTool.getUserInfo() != undefined
}