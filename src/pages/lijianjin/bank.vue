<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getBankActivity, getOauthUrl, claimBankCoupons } from '@/api/lijianjin'
import type { CouponActivity } from '@/types/lijianjin'
import CouponTicket from '@/components/lijianjin/CouponTicket.vue'
import ConsentCheckbox from '@/components/lijianjin/ConsentCheckbox.vue'
import AgreementPopup from '@/components/lijianjin/AgreementPopup.vue'

const activity = ref<CouponActivity | null>(null)
const agreed = ref(false)
const showAgreement = ref(false)
const loading = ref(false)

const totalCount = computed(() =>
	activity.value ? activity.value.coupons.reduce((s, c) => s + c.count, 0) : 0
)

onLoad(async () => {
	const res = await getBankActivity()
	activity.value = res.data
})

function gotoResult(type: string, amount: number): void {
	uni.redirectTo({
		url: `/pages/lijianjin/result?channel=wechat&type=${type}&amount=${amount}`
	})
}

async function onClaim() {
	if (!activity.value) return
	if (!agreed.value) {
		uni.showToast({ title: '请先勾选「我已阅读同意」', icon: 'none' })
		return
	}
	if (loading.value) return
	loading.value = true
	try {
		uni.showLoading({ title: '正在获取授权...', mask: true })
		await getOauthUrl('wechat', location.href)
		uni.showLoading({ title: '正在发放立减金...', mask: true })
		const res = await claimBankCoupons()
		uni.hideLoading()
		gotoResult(res.data.type, res.data.amount)
	} catch (e) {
		uni.hideLoading()
		gotoResult('fail', 0)
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<view class="bank-page">
		<view class="banner">
			<image class="banner-img" src="/static/lijianjin-banner.png" mode="aspectFill" />
		</view>

		<view class="content" v-if="activity">
			<view class="sub-card">
				<view class="title">
					<text class="hl">9</text> 元 银行立减金
				</view>
				<view class="divider" />

				<view class="got-row">
					<text class="got-label">🎁 您获得的卡券</text>
					<text class="got-count">共 {{ totalCount }} 张</text>
				</view>

				<CouponTicket
					v-for="(c, i) in activity.coupons"
					:key="i"
					:coupon="c"
				/>

				<view class="info-block">
					<view class="info-title">适用范围</view>
					<view class="info-text">{{ activity.scope }}</view>
				</view>
				<view class="info-block">
					<view class="info-title">领取须知</view>
					<view class="info-text" v-for="(n, i) in activity.notice" :key="i">{{ i + 1 }}. {{ n }}</view>
				</view>
			</view>
		</view>

		<view class="footer safe-bottom" v-if="activity">
			<view class="consent-line">
				<ConsentCheckbox
					v-model="agreed"
					:agreement-name="activity.agreement.name"
					color="#f4491f"
					@open="showAgreement = true"
				/>
			</view>
			<view class="claim-btn" :class="{ disabled: loading }" @click="onClaim">
				立刻领取
			</view>
		</view>

		<AgreementPopup
			v-if="activity"
			:show="showAgreement"
			channel="wechat"
			:agreement="activity.agreement"
			@close="showAgreement = false"
		/>
	</view>
</template>

<style scoped>
.bank-page {
	min-height: 100vh;
	background: #f2f3f5;
	padding-bottom: 110px;
}

.banner {
	line-height: 0;
	font-size: 0;
}
.banner-img {
	width: 100%;
	height: 300px;
	display: block;
}

.content {
	padding: 0 14px;
	margin-top: -24px;
	position: relative;
	z-index: 2;
}

.sub-card {
	background: #fff;
	border-radius: 14px;
	padding: 20px 16px 22px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.title {
	text-align: center;
	font-size: 18px;
	font-weight: 700;
	color: #333;
}
.title .hl {
	color: #f4491f;
	font-size: 22px;
}

.divider {
	margin: 16px 0;
	border-top: 1px dashed #eee;
}

.got-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 14px;
}
.got-label {
	font-size: 15px;
	font-weight: 600;
}
.got-count {
	font-size: 12px;
	color: #b5b5b5;
	background: #f5f5f5;
	padding: 2px 10px;
	border-radius: 10px;
}

.info-block {
	margin-top: 18px;
	padding-top: 16px;
	border-top: 1px dashed #eee;
}
.info-title {
	font-size: 14px;
	color: #333;
	margin-bottom: 8px;
	font-weight: 600;
}
.info-text {
	font-size: 12px;
	color: #999;
	line-height: 1.9;
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	max-width: 420px;
	margin: 0 auto;
	background: #fff;
	padding: 12px 16px 16px;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}

.consent-line {
	margin-bottom: 10px;
}

.claim-btn {
	width: 100%;
	height: 48px;
	line-height: 48px;
	text-align: center;
	border-radius: 8px;
	background: #fb401b;
	color: #fff;
	font-size: 17px;
	font-weight: 700;
}
.claim-btn.disabled {
	opacity: 0.6;
}
</style>
