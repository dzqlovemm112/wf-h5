/** 系统配置相关  */

// 获取当前环境
export const getEnv = (): 'dev' | 'test' | 'pro' => {
	return process.env.API_ENV;
}

// 是否为生产环境
export const isProdEnv = (): boolean => {
	return process.env.API_ENV === 'pro';
}

const isProd = isProdEnv();

let constant = {
	baseUrl: 'http://test1.sunnyflowers.net:57000',
	client_id: 'yillion-vas',
	client_check_secret: '123123',
	client_secret: 'gPV3eiEkL6NBcJyR',
}

if (isProd) {
	// TOOD:更改为生产配置
	constant = {
		baseUrl: 'http://sunnyflowers.net:57000',
		client_id: 'yillion-vas',
		client_check_secret: '123123',
		client_secret: 'gPV3eiEkL6NBcJyR',
	}
}


/** 系统配置相关  */
export const Constant = constant