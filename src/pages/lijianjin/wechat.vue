<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getActivity } from '@/api/lijianjin'
import { useLijianjinClaim } from '@/composables/useLijianjinClaim'
import type { CouponActivity } from '@/types/lijianjin'
import AgreementPopup from '@/components/lijianjin/AgreementPopup.vue'
import ConsentCheckbox from '@/components/lijianjin/ConsentCheckbox.vue'

const activity = ref<CouponActivity | null>(null)
const agreed = ref(false)
const showAgreement = ref(false)
const couponId = 'wx-1'

const { loading, start } = useLijianjinClaim('wechat', couponId)

const coupon = computed(() => activity.value?.coupons[0] ?? null)

onLoad(async () => {
	const res = await getActivity('wechat')
	activity.value = res.data
})

async function onClaim() {
	// 微信立减金:发放前必须获得用户明确同意(参考微信支付文档)
	if (!agreed.value) {
		uni.showToast({ title: '请先阅读并同意领取协议', icon: 'none' })
		return
	}
	await start()
}

function goBack() {
	const pages = getCurrentPages()
	if (pages.length > 1) {
		uni.navigateBack()
	} else {
		uni.redirectTo({ url: '/pages/index/index' })
	}
}
</script>

<template>
	<view class="wx-page">
		<view class="navbar">
			<text class="nav-back" @click="goBack">‹</text>
			<text class="nav-title">立减金</text>
			<text class="nav-more">···</text>
		</view>

		<view class="hero" v-if="activity && coupon">
			<view class="check-badge">
				<text class="check">✓</text>
			</view>

			<view class="card">
				<view class="amount">
					{{ coupon.amount }}<text class="unit">元</text>{{ coupon.name }}
				</view>
				<view class="desc">{{ activity.scope }}</view>

				<view class="validity" v-if="activity.validFrom && activity.validTo">
					<view class="validity-title">有效期</view>
					<view class="validity-text">
						请在 {{ activity.validFrom }} 到 {{ activity.validTo }} 领取使用,领取后立即生效
					</view>
				</view>
			</view>
		</view>

		<view class="usage" v-if="activity">
			<view class="usage-title">适用范围</view>
			<view class="usage-scope">{{ activity.scope }}</view>
			<view class="usage-title usage-notice-title">领取须知</view>
			<view class="notice-item" v-for="(n, i) in activity.notice" :key="i">
				{{ i + 1 }}. {{ n }}
			</view>
		</view>

		<view class="footer safe-bottom" v-if="activity">
			<view class="consent-wrap">
				<ConsentCheckbox
					v-model="agreed"
					:agreement-name="activity.agreement.name"
					color="#07c160"
					@open="showAgreement = true"
				/>
			</view>
			<view class="claim-btn" :class="{ disabled: loading }" @click="onClaim">
				点击领取 · ¥{{ coupon?.amount }}
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
.wx-page {
	min-height: 100vh;
	background: #f2f3f5;
	padding-bottom: 120px;
}

.navbar {
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 14px;
	background: #f7f7f7;
	font-size: 16px;
	color: #111;
}
.nav-back {
	font-size: 26px;
	line-height: 1;
}
.nav-title {
	font-weight: 600;
}
.nav-more {
	letter-spacing: 1px;
}

.hero {
	position: relative;
	background: linear-gradient(180deg, #ff5a4d 0, #f4491f 46%, #f2f3f5 46%);
	padding: 40px 16px 0;
}

.check-badge {
	width: 74px;
	height: 74px;
	border-radius: 50%;
	background: #07c160;
	border: 5px solid #fff;
	margin: 0 auto -37px;
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 6px 16px rgba(7, 193, 96, 0.3);
}
.check {
	color: #fff;
	font-size: 36px;
	font-weight: 700;
	line-height: 1;
}

.card {
	background: #fff;
	border-radius: 16px;
	padding: 50px 20px 22px;
	text-align: center;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.amount {
	font-size: 26px;
	font-weight: 800;
	color: #f4491f;
}
.amount .unit {
	font-size: 15px;
	margin: 0 2px;
}

.desc {
	margin-top: 12px;
	font-size: 13px;
	color: #888;
	line-height: 1.7;
}

.validity {
	margin-top: 20px;
	padding-top: 16px;
	border-top: 1px solid #f0f0f0;
	text-align: left;
}
.validity-title {
	font-size: 14px;
	margin-bottom: 8px;
	font-weight: 600;
}
.validity-text {
	font-size: 12px;
	color: #999;
	line-height: 1.7;
}

.usage {
	margin: 16px;
	padding: 18px;
	background: #fff;
	border-radius: 14px;
}
.usage-title {
	font-size: 15px;
	font-weight: 600;
	margin-bottom: 12px;
}
.usage-scope {
	font-size: 13px;
	color: #666;
	line-height: 1.8;
	margin-bottom: 16px;
}
.usage-notice-title {
	margin-top: 4px;
}
.notice-item {
	font-size: 13px;
	color: #666;
	line-height: 2;
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	max-width: 420px;
	margin: 0 auto;
	background: #fff;
	padding: 10px 16px 14px;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
	z-index: 20;
}

.claim-btn {
	width: 100%;
	height: 48px;
	line-height: 48px;
	text-align: center;
	border-radius: 24px;
	background: linear-gradient(90deg, #16c268, #07c160);
	color: #fff;
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 1px;
	box-shadow: 0 8px 18px rgba(7, 193, 96, 0.32);
}
.claim-btn.disabled {
	opacity: 0.6;
}

.consent-wrap {
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
}
</style>
