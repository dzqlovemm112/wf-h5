/**
 * 积分商城 Mock 接口层
 * 说明：当前为前端演示数据，接入真实后端时把各函数体替换为 http 请求即可（出入参类型不变）。
 */
import type {
	ApiResp,
	Banner,
	CashierInfo,
	HomeData,
	MallOrder,
	MallUser,
	OrderStatus,
	ProductCategory,
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

const BANNERS: Banner[] = [
	{
		id: 'b1',
		title: '新人专享礼',
		subtitle: '首次兑换立减 500 积分',
		bg: 'linear-gradient(135deg, #7b5cff 0%, #5a3df0 100%)',
		emoji: '🎁'
	},
	{
		id: 'b2',
		title: '话费充值 88 折',
		subtitle: '三网话费 限时特惠',
		bg: 'linear-gradient(135deg, #ff9a5b 0%, #ff5e62 100%)',
		emoji: '📱'
	},
	{
		id: 'b3',
		title: '微信红包专区',
		subtitle: '立减金 / 现金红包 秒到账',
		bg: 'linear-gradient(135deg, #ff6a6a 0%, #d7263d 100%)',
		emoji: '🧧'
	}
]

const KING_KONG: QuickNav[] = [
	{ key: 'recharge', label: '话费充值', icon: 'phone-fill', color: '#ff6a5b' },
	{ key: 'oil', label: '加油卡', icon: 'car-fill', color: '#2e7dff' },
	{ key: 'lijianjin', label: '立减金', icon: 'coupon-fill', color: '#8b5cf6' },
	{ key: 'redpacket', label: '现金红包', icon: 'red-packet-fill', color: '#ff4d4f' },
	{ key: 'payment', label: '生活缴费', icon: 'home-fill', color: '#12b76a' },
	{ key: 'tmall', label: '天猫超市', icon: 'tags-fill', color: '#ff0036' },
	{ key: 'jd', label: '京东购物', icon: 'bag-fill', color: '#e1251b' },
	{ key: 'hema', label: '盒马鲜生', icon: 'shopping-cart-fill', color: '#0a8bff' },
	{ key: 'integral', label: '积分商城', icon: 'integral-fill', color: '#f59e0b' },
	{ key: 'more', label: '更多', icon: 'grid-fill', color: '#6a5ae0' }
]

const CATEGORIES: ProductCategory[] = [
	{
		key: 'recharge',
		title: '充值类',
		subtitle: '三网话费 · 中石化券',
		icon: 'phone-fill',
		color: '#ff6a5b',
		products: [
			{ id: 'hf100', name: '三网话费充值 100元', brand: '话费', color: 'linear-gradient(135deg,#ff8a5b,#ff5e62)', face: '¥100', points: 9800, tag: '热销' },
			{ id: 'hf50', name: '三网话费充值 50元', brand: '话费', color: 'linear-gradient(135deg,#ff8a5b,#ff5e62)', face: '¥50', points: 4900 },
			{ id: 'oil100', name: '中石化加油券 100元', brand: '中石化', color: 'linear-gradient(135deg,#3d8bff,#2e5cff)', face: '¥100', points: 9600, tag: '限时' },
			{ id: 'oil50', name: '中石化加油券 50元', brand: '中石化', color: 'linear-gradient(135deg,#3d8bff,#2e5cff)', face: '¥50', points: 4850 }
		]
	},
	{
		key: 'redpacket',
		title: '虚拟微信现金红包',
		subtitle: '立减金 · 现金红包 秒到账',
		icon: 'red-packet-fill',
		color: '#ff4d4f',
		products: [
			{ id: 'ljj5', name: '微信立减金 5元', brand: '立减金', color: 'linear-gradient(135deg,#ff7a7a,#ff4d4f)', face: '¥5', points: 480, tag: '秒到' },
			{ id: 'hb10', name: '微信现金红包 10元', brand: '红包', color: 'linear-gradient(135deg,#ff6a6a,#d7263d)', face: '¥10', points: 950 },
			{ id: 'ljj20', name: '微信立减金 20元', brand: '立减金', color: 'linear-gradient(135deg,#ff7a7a,#ff4d4f)', face: '¥20', points: 1900 },
			{ id: 'hb50', name: '微信现金红包 50元', brand: '红包', color: 'linear-gradient(135deg,#ff6a6a,#d7263d)', face: '¥50', points: 4800, tag: '热销' }
		]
	},
	{
		key: 'payment',
		title: '便民缴费红包类',
		subtitle: '光大云缴费 · 缴费立减',
		icon: 'home-fill',
		color: '#12b76a',
		products: [
			{ id: 'pay-water', name: '光大云缴费·水费红包 20元', brand: '光大', color: 'linear-gradient(135deg,#22c993,#12b76a)', face: '¥20', points: 1900, tag: '缴费立减' },
			{ id: 'pay-elec', name: '光大云缴费·电费红包 30元', brand: '光大', color: 'linear-gradient(135deg,#22c993,#12b76a)', face: '¥30', points: 2850 },
			{ id: 'pay-gas', name: '光大云缴费·燃气红包 20元', brand: '光大', color: 'linear-gradient(135deg,#22c993,#12b76a)', face: '¥20', points: 1900 }
		]
	},
	{
		key: 'prepaid',
		title: '预付费卡券',
		subtitle: '天猫 · 京东 · 盒马',
		icon: 'tags-fill',
		color: '#ff6a00',
		products: [
			{ id: 'tmall100', name: '天猫超市卡 100元', brand: '天猫', color: 'linear-gradient(135deg,#ff5b7f,#ff0036)', face: '¥100', points: 9700, tag: '热销' },
			{ id: 'jd100', name: '京东E卡 100元', brand: '京东', color: 'linear-gradient(135deg,#ff5b5b,#e1251b)', face: '¥100', points: 9650 },
			{ id: 'hema100', name: '盒马礼品卡 100元', brand: '盒马', color: 'linear-gradient(135deg,#3db4ff,#0a8bff)', face: '¥100', points: 9700 },
			{ id: 'tmall50', name: '天猫超市卡 50元', brand: '天猫', color: 'linear-gradient(135deg,#ff5b7f,#ff0036)', face: '¥50', points: 4850 }
		]
	}
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
		banners: BANNERS,
		kingKong: KING_KONG,
		activities: ACTIVITIES,
		categories: CATEGORIES
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
