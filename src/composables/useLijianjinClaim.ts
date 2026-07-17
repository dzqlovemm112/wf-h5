import { ref } from 'vue'
import type { Channel, ClaimResult } from '@/types/lijianjin'
import { claimCoupon, getOauthUrl } from '@/api/lijianjin'
import { detectChannel } from '@/utils/lijianjin'
import { isProdEnv } from '@/utils/constant'

// 封装"授权 -> 发放 -> 结果"的通用领取流程
export function useLijianjinClaim(channel: Channel, couponId: string) {
	const loading = ref(false)

	function gotoResult(type: string, amount: number): void {
		uni.redirectTo({
			url: `/pages/lijianjin/result?channel=${channel}&type=${type}&amount=${amount}`
		})
	}

	async function start(): Promise<void> {
		if (loading.value) return
		loading.value = true
		try {
			// 1. 授权:真实环境需跳转微信/支付宝授权拿到 openid/user_id。
			//    这里在非微信/支付宝环境下用 mock 模拟,不做真实跳转。
			uni.showLoading({ title: '正在获取授权...', mask: true })
			const oauth = await getOauthUrl(channel, location.href)
			const inClient = detectChannel() === channel
			if (inClient && isProdEnv()) {
				// 真实客户端内:跳转授权(演示环境默认不会进入这里)
				location.href = oauth.data.url
				return
			}

			// 2. 发放
			uni.showLoading({ title: '正在发放立减金...', mask: true })
			const res = await claimCoupon(channel, couponId)
			const result: ClaimResult = res.data

			// 3. 跳转结果页
			uni.hideLoading()
			gotoResult(result.type, result.amount)
		} catch (e) {
			uni.hideLoading()
			gotoResult('fail', 0)
		} finally {
			loading.value = false
		}
	}

	return { loading, start }
}
