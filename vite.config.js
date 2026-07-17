import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		uni(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	define: {
		'process.env.API_ENV': JSON.stringify(process.env.API_ENV || ''),
		'process.env.UNI_PLATFORM': JSON.stringify(process.env.UNI_PLATFORM || ''),
	},
	base: '/', //配置目录，不是根目录要配置对应的目录比如：https://www.baidu.com/dist/ 要配置 base:'/dist/',
	server: {
		open: true,
		// http://localhost:5173/api/login -> http://www.test.com/login
		proxy: {
			//api是自行设置的请求前缀，任何请求路径以/api开头的请求将被代理到对应的target目标
			'/api': {
				target: 'http://test2.sunnyflowers.net:57000', //需要代理的域名，目标域名
				changeOrigin: true, //需要代理跨域
				rewrite: (path) => path.replace(/^\/api/, ''), //路径重写，把'/api'替换为''
			},
		},
	},
})