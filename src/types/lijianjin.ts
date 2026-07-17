// 立减金渠道
export type Channel = 'wechat' | 'alipay'

// 协议信息
export interface Agreement {
	// 协议名称,如《微信立减金领取协议》
	name: string
	// 协议正文(接口可能返回富文本/纯文本;不返回时前端用默认文案兜底)
	content?: string
}

// 单张立减金(用于票券展示)
export interface Coupon {
	// 面额(元)
	amount: number
	// 券名称
	name: string
	// 数量(多张同款时,默认 1)
	count: number
	// 使用门槛(元),可选,接口不返回则视为无门槛
	threshold?: number
}

// 立减金活动信息
// 说明:真实接口核心只返回「金额、领取须知、适用范围、协议」等字段,
// 其余(有效期、门槛、品牌等)均为可选,接口未返回时页面自动隐藏。
export interface CouponActivity {
	// 渠道
	channel: Channel
	// ==== 接口核心字段 ====
	// 券列表(至少一张,单券活动即长度为 1)
	coupons: Coupon[]
	// 适用范围
	scope: string
	// 领取须知(多条)
	notice: string[]
	// 协议
	agreement: Agreement
	// 是否需要用户明确同意(微信立减金必须)
	requireConsent: boolean
	// ==== 可选字段(接口可能不返回) ====
	// 活动标题
	title?: string
	// 品牌 / 主办方
	brand?: string
	// 领取有效期开始
	validFrom?: string
	// 领取有效期结束
	validTo?: string
}

// 领取结果类型
export type ClaimResultType = 'success' | 'claimed' | 'expired' | 'fail'

// 领取结果
export interface ClaimResult {
	type: ClaimResultType
	amount: number
	message: string
}

// 通用接口响应
export interface ApiResponse<T> {
	code: number
	message: string
	data: T
}
