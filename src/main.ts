import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia';
import uviewPlus from 'uview-plus';
import VConsole from "vconsole";
import { isProdEnv } from "@/utils/constant";
const isProd = isProdEnv();

export function createApp() {
	console.log('当前环境：', process.env.API_ENV);
	console.log('当前平台：', process.env.UNI_PLATFORM);
	console.log('是否为生产环境：', isProd);

	const app = createSSRApp(App);
	const pinia = createPinia();

	if (!isProd) {
		if (typeof window !== 'undefined') {
			new VConsole();
		}
	}
	// 使用 uView UI
	app.use(uviewPlus)

	// pinia
	app.use(pinia)

	return {
		app,
	};
}