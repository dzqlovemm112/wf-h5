/**
 * 积分商城 Mock 接口层
 * 说明：当前为前端演示数据，接入真实后端时把各函数体替换为 http 请求即可（出入参类型不变）。
 */
import type {
	ApiResp,
	CashierInfo,
	ExchangeItem,
	HomeData,
	MallOrder,
	MallUser,
	OrderStatus,
	QuickNav,
	MallActivity
} from '@/types/mall'

const delay = <T>(data: T, ms = 300): Promise<ApiResp<T>> =>
	new Promise((resolve) => {
		setTimeout(() => resolve({ code: 200, message: 'ok', data }), ms)
	})

const USER: MallUser = {
	nickname: '白凤',
	avatar: '/static/mall-avatar.png',
	phone: '186****9825',
	points: 12520
}

const QUICK_NAVS: QuickNav[] = [
	{ key: 'all', label: '全部', icon: 'grid', color: '#6A5AE0' },
	{ key: 'jd', label: '京东服务', icon: 'bag', color: '#e1251b' },
	{ key: 'meituan', label: '美团外卖', icon: 'car', color: '#ffb000' },
	{ key: 'taobao', label: '淘宝闪购', icon: 'shopping-cart', color: '#ff5000' },
	{ key: 'lijianjin', label: '立减金', icon: 'coupon', color: '#8b5cf6' }
]

const ACTIVITIES: MallActivity[] = [
	{
		id: 'lottery',
		title: '抽奖领积分',
		subtitle: '每日 1 次机会 积分好礼拿',
		bg: 'linear-gradient(135deg, #ff6a5b 0%, #d7263d 100%)',
		emoji: '🎡'
	},
	{
		id: 'sign',
		title: '签到',
		subtitle: '立即签到领好礼',
		bg: 'linear-gradient(135deg, #5b8cff 0%, #3d5afe 100%)',
		emoji: '📅'
	},
	{
		id: 'task',
		title: '做任务领积分',
		subtitle: '轻松赚积分',
		bg: 'linear-gradient(135deg, #7b5cff 0%, #5a3df0 100%)',
		emoji: '🎯'
	}
]

const EXCHANGE_ITEMS: ExchangeItem[] = [
	{ id: 'tencent', name: '腾讯视频VIP会员', brand: '腾讯视频', color: '#ff9a2e', minPoints: 200 },
	{ id: 'youku', name: '优酷视频VIP会员', brand: 'YOUKU', color: '#1cb0f6', minPoints: 200 },
	{ id: 'iqiyi', name: '爱奇艺VIP会员', brand: 'iQIYI', color: '#22c55e', minPoints: 200 },
	{ id: 'bilibili', name: '哔哩哔哩VIP会员', brand: 'bilibili', color: '#fb7299', minPoints: 200 }
]

const ORDERS: MallOrder[] = [
	{ id: 'o1', itemName: '腾讯视频VIP会员(月卡)', brand: '腾讯视频', color: '#ff9a2e', points: 200, status: 'processing', createdAt: '2026-06-20 10:24' },
	{ id: 'o2', itemName: '优酷视频VIP会员(月卡)', brand: 'YOUKU', color: '#1cb0f6', points: 200, status: 'done', createdAt: '2026-06-18 19:02' },
	{ id: 'o3', itemName: '爱奇艺VIP会员(月卡)', brand: 'iQIYI', color: '#22c55e', points: 200, status: 'done', createdAt: '2026-06-15 08:47' },
	{ id: 'o4', itemName: '哔哩哔哩VIP会员(月卡)', brand: 'bilibili', color: '#fb7299', points: 200, status: 'failed', createdAt: '2026-06-12 21:15' },
	{ id: 'o5', itemName: '京东E卡 50 元', brand: '京东', color: '#e1251b', points: 5000, status: 'abnormal', createdAt: '2026-06-10 12:33' }
]

const CASHIER: CashierInfo = {
	orderId: 'demo-order',
	amount: 67.95,
	originalAmount: 67.95,
	orderAmount: 67.95,
	serviceFee: 0,
	beanCount: 0,
	beanDeduction: 0
}

const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
	processing: '处理中',
	done: '已完成',
	failed: '兑换失败',
	abnormal: '兑换异常'
}

export function getOrderStatusText(status: OrderStatus): string {
	return ORDER_STATUS_TEXT[status]
}

export function getUserInfo(): Promise<ApiResp<MallUser>> {
	return delay(USER)
}

export function getHomeData(): Promise<ApiResp<HomeData>> {
	return delay({
		user: USER,
		quickNavs: QUICK_NAVS,
		activities: ACTIVITIES,
		exchangeItems: EXCHANGE_ITEMS
	})
}

export function getOrders(status?: OrderStatus): Promise<ApiResp<MallOrder[]>> {
	const list = status ? ORDERS.filter((o) => o.status === status) : ORDERS
	return delay(list)
}

export function getOrderStatusCount(): Promise<ApiResp<Record<OrderStatus, number>>> {
	const count: Record<OrderStatus, number> = { processing: 0, done: 0, failed: 0, abnormal: 0 }
	ORDERS.forEach((o) => (count[o.status] += 1))
	return delay(count)
}

export function getCashierInfo(_orderId?: string): Promise<ApiResp<CashierInfo>> {
	return delay(CASHIER)
}

export function payOrder(_orderId: string): Promise<ApiResp<{ success: boolean }>> {
	return delay({ success: true }, 600)
}

/** 卡密兑换积分 */
export function exchangeByCardKey(cardKey: string): Promise<ApiResp<{ points: number }>> {
	if (!cardKey) {
		return Promise.resolve({ code: 400, message: '请输入卡密', data: { points: 0 } })
	}
	return delay({ points: 500 }, 600)
}

/**
 * 微信快捷登录（Mock）
 * 真实流程：MP-WEIXIN 用 uni.login 拿 code → 服务端换 openid/session；
 * H5 走微信 OAuth 授权拿 code → 服务端换取用户标识。
 */
export function wechatLogin(code: string): Promise<ApiResp<{ token: string; needBindPhone: boolean }>> {
	return delay({ token: 'mock-token-' + code, needBindPhone: true }, 500)
}

/**
 * 绑定手机号（Mock）
 * MP-WEIXIN：getPhoneNumber 回调拿加密数据 → 服务端解密；
 * H5：手机号 + 短信验证码。
 */
export function bindPhone(params: { phone?: string; code?: string; encryptedData?: string; iv?: string }): Promise<ApiResp<MallUser>> {
	if (!params.phone && !params.encryptedData) {
		return Promise.resolve({ code: 400, message: '缺少手机号信息', data: USER })
	}
	return delay(USER, 500)
}

/** 发送短信验证码（H5 用，Mock） */
export function sendSmsCode(phone: string): Promise<ApiResp<{ sent: boolean }>> {
	if (!/^1\d{10}$/.test(phone)) {
		return Promise.resolve({ code: 400, message: '手机号格式不正确', data: { sent: false } })
	}
	return delay({ sent: true }, 400)
}
