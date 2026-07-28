/** 积分商城相关类型 */

/** 用户信息 */
export interface MallUser {
	nickname: string
	avatar: string
	/** 已脱敏手机号，如 186****9825 */
	phone: string
	/** 可用积分 */
	points: number
}

/** 首页快捷入口 */
export interface QuickNav {
	key: string
	label: string
	/** uview-plus 图标名 */
	icon: string
	/** 图标背景色 */
	color: string
}

/** 商城活动 banner */
export interface MallActivity {
	id: string
	title: string
	subtitle: string
	/** 卡片渐变背景 */
	bg: string
	emoji: string
}

/** 热门兑换商品 */
export interface ExchangeItem {
	id: string
	name: string
	/** 品牌短名，用于色块 logo */
	brand: string
	/** 品牌主色 */
	color: string
	/** 最低可兑换积分 */
	minPoints: number
}

/** 兑换订单状态 */
export type OrderStatus = 'processing' | 'done' | 'failed' | 'abnormal'

/** 兑换订单 */
export interface MallOrder {
	id: string
	itemName: string
	brand: string
	color: string
	points: number
	status: OrderStatus
	createdAt: string
}

/** 收银台支付明细 */
export interface CashierInfo {
	orderId: string
	/** 实付金额 */
	amount: number
	/** 划线原价 */
	originalAmount: number
	/** 订单金额 */
	orderAmount: number
	/** 服务费 */
	serviceFee: number
	/** 福豆可抵扣数量 */
	beanCount: number
	/** 福豆抵扣金额 */
	beanDeduction: number
}

/** 首页聚合数据 */
export interface HomeData {
	user: MallUser
	quickNavs: QuickNav[]
	activities: MallActivity[]
	exchangeItems: ExchangeItem[]
}

export interface ApiResp<T> {
	code: number
	message: string
	data: T
}
