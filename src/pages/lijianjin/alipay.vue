<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getActivity } from '@/api/lijianjin'
import { useLijianjinClaim } from '@/composables/useLijianjinClaim'
import type { CouponActivity } from '@/types/lijianjin'
import AgreementPopup from '@/components/lijianjin/AgreementPopup.vue'

const activity = ref<CouponActivity | null>(null)
const showAgreement = ref(false)
const couponId = 'ali-1'

const { loading, start } = useLijianjinClaim('alipay', couponId)

const coupon = computed(() => activity.value?.coupons[0] ?? null)
const threshold = computed(() => coupon.value?.threshold ?? 0)
// 满减描述:有门槛显示「满 X 元可用」,无门槛显示「无门槛」
const condText = computed(() =>
	threshold.value > 0 ? `满 ${threshold.value} 元可用` : '无门槛立减'
)

onLoad(async () => {
	const res = await getActivity('alipay')
	activity.value = res.data
})

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
	<view class="ali-page">
		<view class="navbar">
			<text class="nav-back" @click="goBack">‹</text>
			<text class="nav-title">立减金</text>
			<text class="nav-more">···</text>
		</view>

		<template v-if="activity && coupon">
			<!-- 顶部品牌区(压缩高度) -->
			<view class="hero">
				<view class="brand">
					<view class="brand-logo"><text class="brand-icon">支</text></view>
					<text class="brand-name">{{ activity.brand ?? activity.title ?? '支付宝立减金' }}</text>
				</view>
			</view>

			<!-- 立减金票券(上探,骑在蓝色和白色之间) -->
			<view class="ticket-wrap">
				<view class="ticket">
					<view class="ticket-shine" />
					<view class="ticket-left">
						<view class="amount">
							<text class="sym">¥</text>{{ coupon.amount }}
						</view>
						<view class="cond">{{ condText }}</view>
					</view>
					<view class="ticket-right">
						<view class="tag-row">
							<text class="name">{{ coupon.name }}</text>
							<text class="badge">{{ threshold > 0 ? '满减券' : '无门槛' }}</text>
						</view>
						<view class="rule" v-if="threshold > 0">
							满 {{ threshold }} 元立减 {{ coupon.amount }} 元
						</view>
						<view class="rule" v-else>下单立减 {{ coupon.amount }} 元</view>
						<view class="valid" v-if="activity.validTo">
							有效期至 {{ activity.validTo.slice(0, 10) }}
						</view>
						<view class="valid" v-else>领取后立即生效,尽快使用</view>
					</view>
				</view>
			</view>

			<!-- 满减规则条 -->
			<view class="rule-strip">
				<view class="rs-item">
					<text class="rs-num">¥{{ coupon.amount }}</text>
					<text class="rs-label">立减金额</text>
				</view>
				<view class="rs-sep" />
				<view class="rs-item">
					<text class="rs-num">{{ threshold > 0 ? `¥${threshold}` : '无门槛' }}</text>
					<text class="rs-label">使用门槛</text>
				</view>
				<view class="rs-sep" />
				<view class="rs-item">
					<text class="rs-num">{{ coupon.count }} 张</text>
					<text class="rs-label">可领数量</text>
				</view>
			</view>

			<!-- 详情卡片 -->
			<view class="detail">
				<view class="row" v-if="activity.validFrom && activity.validTo">
					<text class="row-icon">🕑</text>
					<view class="row-main">
						<view class="row-title">有效期</view>
						<view class="row-text">{{ activity.validFrom }} 至 {{ activity.validTo }},领取后立即生效</view>
					</view>
				</view>
				<view class="row">
					<text class="row-icon">🛍️</text>
					<view class="row-main">
						<view class="row-title">适用范围</view>
						<view class="row-text">{{ activity.scope }}</view>
					</view>
				</view>
				<view class="row">
					<text class="row-icon">📋</text>
					<view class="row-main">
						<view class="row-title">领取须知</view>
						<view class="row-text" v-for="(n, i) in activity.notice" :key="i">{{ i + 1 }}. {{ n }}</view>
					</view>
				</view>
			</view>

			<!-- 底部固定操作栏 -->
			<view class="footer safe-bottom">
				<view class="agree-tip" @click="showAgreement = true">
					领取即视为同意 <text class="agree-link">{{ activity.agreement.name }}</text>
				</view>
				<view class="claim-btn" :class="{ disabled: loading }" @click="start">
					立即领取 · ¥{{ coupon.amount }}
				</view>
			</view>
		</template>

		<AgreementPopup
			v-if="activity"
			:show="showAgreement"
			channel="alipay"
			:agreement="activity.agreement"
			@close="showAgreement = false"
		/>
	</view>
</template>

<style scoped>
.ali-page {
	min-height: 100vh;
	background: #eef2f7;
	padding-bottom: 110px;
}

.navbar {
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 14px;
	font-size: 16px;
	color: #fff;
	position: relative;
	z-index: 2;
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

/* 顶部蓝色区(压缩) */
.hero {
	position: relative;
	margin-top: -44px;
	padding: 56px 18px 46px;
	background: linear-gradient(160deg, #2a8bff 0%, #1677ff 60%, #0e5fd8 100%);
	overflow: hidden;
}
.hero::before {
	content: '';
	position: absolute;
	width: 180px;
	height: 180px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.08);
	top: -60px;
	right: -40px;
}
.brand {
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
}
.brand-logo {
	width: 26px;
	height: 26px;
	border-radius: 7px;
	background: rgba(255, 255, 255, 0.18);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8px;
}
.brand-icon {
	color: #fff;
	font-size: 15px;
	font-weight: 700;
}
.brand-name {
	color: #fff;
	font-size: 15px;
	font-weight: 600;
}

/* 票券:负边距上探 */
.ticket-wrap {
	padding: 0 16px;
	margin-top: -34px;
	position: relative;
	z-index: 3;
}
.ticket {
	position: relative;
	display: flex;
	align-items: stretch;
	background: #fff;
	border-radius: 14px;
	overflow: hidden;
	box-shadow: 0 12px 28px rgba(9, 60, 140, 0.22);
}
.ticket-shine {
	position: absolute;
	top: 0;
	left: -60%;
	width: 50%;
	height: 100%;
	background: linear-gradient(
		100deg,
		transparent,
		rgba(255, 255, 255, 0.55),
		transparent
	);
	transform: skewX(-20deg);
	animation: shine 2.8s ease-in-out infinite;
}
@keyframes shine {
	0% {
		left: -60%;
	}
	55%,
	100% {
		left: 140%;
	}
}
.ticket-left {
	flex: 0 0 42%;
	padding: 20px 10px 20px 20px;
	color: #1677ff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
	box-sizing: border-box;
}
.ticket-left::after {
	content: '';
	position: absolute;
	right: 0;
	top: 14px;
	bottom: 14px;
	border-right: 2px dashed #d6e4ff;
}
.amount {
	font-size: 44px;
	font-weight: 800;
	line-height: 1;
}
.amount .sym {
	font-size: 20px;
	margin-right: 2px;
}
.cond {
	margin-top: 8px;
	font-size: 12px;
	color: #7a93b8;
}
.ticket-right {
	flex: 1;
	padding: 18px 16px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.tag-row {
	display: flex;
	align-items: center;
	margin-bottom: 7px;
}
.name {
	font-size: 15px;
	font-weight: 700;
	color: #223;
	margin-right: 8px;
}
.badge {
	font-size: 10px;
	color: #ff7a00;
	border: 1px solid #ffcf99;
	background: #fff6ec;
	border-radius: 4px;
	padding: 1px 5px;
}
.rule {
	font-size: 12px;
	color: #ff6b2c;
	font-weight: 600;
	margin-bottom: 7px;
}
.valid {
	font-size: 11px;
	color: #a2acbb;
}

/* 满减规则条 */
.rule-strip {
	margin: 14px 16px 0;
	padding: 16px 0;
	background: #fff;
	border-radius: 14px;
	display: flex;
	align-items: center;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}
.rs-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.rs-num {
	font-size: 17px;
	font-weight: 800;
	color: #1677ff;
	margin-bottom: 4px;
}
.rs-label {
	font-size: 11px;
	color: #97a0ad;
}
.rs-sep {
	width: 1px;
	height: 26px;
	background: #eef1f5;
}

/* 详情 */
.detail {
	margin: 14px 16px 0;
	padding: 6px 16px;
	background: #fff;
	border-radius: 14px;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}
.row {
	display: flex;
	padding: 16px 0;
	border-bottom: 1px solid #f2f4f7;
}
.row:last-child {
	border-bottom: none;
}
.row-icon {
	flex: 0 0 auto;
	width: 30px;
	height: 30px;
	border-radius: 9px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	background: #eef4ff;
	margin-right: 12px;
}
.row-main {
	flex: 1;
}
.row-title {
	font-size: 14px;
	margin-bottom: 6px;
	color: #222;
	font-weight: 600;
}
.row-text {
	font-size: 12px;
	color: #97a0ad;
	line-height: 1.8;
}

/* 底部固定操作栏 */
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
.agree-tip {
	text-align: center;
	font-size: 12px;
	color: #98a2b3;
	margin-bottom: 8px;
}
.agree-link {
	color: #1677ff;
}
.claim-btn {
	width: 100%;
	height: 48px;
	line-height: 48px;
	text-align: center;
	border-radius: 24px;
	background: linear-gradient(90deg, #2a8bff, #1677ff);
	color: #fff;
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 1px;
	box-shadow: 0 8px 18px rgba(22, 119, 255, 0.32);
}
.claim-btn.disabled {
	opacity: 0.6;
}
</style>
