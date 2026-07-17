import type {
	ApiResponse,
	Channel,
	ClaimResult,
	CouponActivity
} from '@/types/lijianjin'

// ==== 说明 ====
// 这是前端演示用的 Mock 接口层。接入真实后端时,把每个函数体内的
// mock 逻辑替换为 @/api/api 中封装的 http 请求即可(保持出入参类型不变)。
//
// 真实接口的活动信息核心只返回:金额、领取须知、适用范围、协议等字段,
// 页面完全由这些字段动态渲染。有效期、门槛、品牌为可选,接口不返回则不展示。
//
// 微信立减金 / 支付宝立减金 的发放都需要在服务端调用对应开放平台接口,
// 前端只负责: 采集用户同意 -> 引导授权(拿到 openid/user_id) -> 触发发放 -> 展示结果。

function delay<T>(data: T, ms = 800): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function ok<T>(data: T): ApiResponse<T> {
	return { code: 200, message: 'success', data }
}

// 预置的演示活动数据(仅保留接口通常会返回的字段)
const ACTIVITIES: Record<Channel, CouponActivity> = {
	wechat: {
		channel: 'wechat',
		coupons: [{ amount: 3.21, name: '微信立减金', count: 1 }],
		scope: '适用于微信支付全场景,支付时满足条件自动抵扣,资金实时到账。',
		notice: [
			'每个微信账号限领 1 张,先到先得,领完即止。',
			'立减金仅限本人使用,不可提现、不可转赠。',
			'打开微信 →「我」→「服务」→「钱包」→「券」可查看已领取的立减金。',
			'支付时满足门槛将自动抵扣,订单退款后立减金按规则处理。'
		],
		agreement: { name: '《微信立减金领取协议》' },
		requireConsent: true
	},
	alipay: {
		channel: 'alipay',
		coupons: [{ amount: 5, name: '支付宝立减金', count: 1, threshold: 100 }],
		scope: '适用于支付宝付款场景,单笔支付满 100 元可用,自动抵扣。',
		notice: [
			'每个支付宝账号限领 1 张,先到先得,领完即止。',
			'立减金仅限本人使用,不可提现、不可转赠。',
			'支付时满足门槛自动抵扣,订单退款按规则处理。'
		],
		agreement: { name: '《支付宝立减金领取协议》' },
		requireConsent: false
	}
}

// 银行多卡券活动(参照运营活动: 共 N 张)
export const BANK_ACTIVITY: CouponActivity = {
	channel: 'wechat',
	title: '9元 银行立减金',
	brand: '惠享银行 · 新春福利',
	coupons: [{ amount: 1, name: '立减金', count: 9 }],
	scope: '适用于微信支付全场景,单张无门槛,可叠加使用。',
	notice: [
		'请确认你的权益卡券,确认无误后点击领取。',
		'每个账号限领对应数量,先到先得,领完即止。',
		'立减金不可提现、不可转赠,仅限本人使用。'
	],
	agreement: { name: '《立减金领取协议》' },
	requireConsent: true
}

// 查询活动信息
export function getActivity(channel: Channel): Promise<ApiResponse<CouponActivity>> {
	return delay(ok(ACTIVITIES[channel]), 500)
}

export function getBankActivity(): Promise<ApiResponse<CouponActivity>> {
	return delay(ok(BANK_ACTIVITY), 500)
}

// 获取授权跳转链接(真实环境由后端返回)
// 微信: snsapi_base 静默授权链接; 支付宝: 用户信息授权链接
export function getOauthUrl(
	channel: Channel,
	redirectPath: string
): Promise<ApiResponse<{ url: string }>> {
	// 真实环境返回 open.weixin.qq.com / openauth.alipay.com 的授权 URL
	const mockUrl =
		channel === 'wechat'
			? `https://open.weixin.qq.com/connect/oauth2/authorize?redirect=${encodeURIComponent(
					redirectPath
			  )}`
			: `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?redirect=${encodeURIComponent(
					redirectPath
			  )}`
	return delay(ok({ url: mockUrl }), 300)
}

const CLAIM_KEY_PREFIX = 'lijianjin_claimed_'

// 演示用的防重复领取(真实环境必须由服务端完成)
function isClaimed(key: string): boolean {
	try {
		return !!uni.getStorageSync(key)
	} catch (e) {
		return false
	}
}

function markClaimed(key: string): void {
	try {
		uni.setStorageSync(key, String(Date.now()))
	} catch (e) {
		// ignore
	}
}

// 领取立减金
export function claimCoupon(
	channel: Channel,
	couponId: string
): Promise<ApiResponse<ClaimResult>> {
	const key = CLAIM_KEY_PREFIX + channel + '_' + couponId
	const activity = channel === 'wechat' ? ACTIVITIES.wechat : ACTIVITIES.alipay
	const amount = activity.coupons[0]?.amount ?? 0

	// 已领取过
	if (isClaimed(key)) {
		return delay(
			ok<ClaimResult>({
				type: 'claimed',
				amount,
				message: '你已领取过该立减金,请勿重复领取'
			}),
			800
		)
	}

	markClaimed(key)
	return delay(
		ok<ClaimResult>({
			type: 'success',
			amount,
			message: '领取成功'
		}),
		1000
	)
}

// 领取银行多卡券
export function claimBankCoupons(): Promise<ApiResponse<ClaimResult>> {
	const key = CLAIM_KEY_PREFIX + 'bank'
	const total = BANK_ACTIVITY.coupons.reduce(
		(sum, c) => sum + c.amount * c.count,
		0
	)
	if (isClaimed(key)) {
		return delay(
			ok<ClaimResult>({
				type: 'claimed',
				amount: total,
				message: '你已领取过该权益,请勿重复领取'
			}),
			800
		)
	}
	markClaimed(key)
	return delay(
		ok<ClaimResult>({ type: 'success', amount: total, message: '领取成功' }),
		1000
	)
}
