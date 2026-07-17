import type { Channel } from '@/types/lijianjin'

// 判断是否在微信内置浏览器
export function isWechat(): boolean {
	if (typeof navigator === 'undefined') return false
	return /micromessenger/i.test(navigator.userAgent)
}

// 判断是否在支付宝客户端
export function isAlipay(): boolean {
	if (typeof navigator === 'undefined') return false
	return /alipayclient/i.test(navigator.userAgent)
}

// 根据 UA 推断当前渠道; 无法识别时返回 null
export function detectChannel(): Channel | null {
	if (isWechat()) return 'wechat'
	if (isAlipay()) return 'alipay'
	return null
}

// 渠道文案 / 主题配置
export interface ChannelMeta {
	label: string
	// 主题主色
	primary: string
	// 客户端名称
	appName: string
	// 到账去向
	wallet: string
}

export const CHANNEL_META: Record<Channel, ChannelMeta> = {
	wechat: {
		label: '微信立减金',
		primary: '#07c160',
		appName: '微信',
		wallet: '微信零钱/微信支付'
	},
	alipay: {
		label: '支付宝立减金',
		primary: '#1677ff',
		appName: '支付宝',
		wallet: '支付宝卡包'
	}
}
