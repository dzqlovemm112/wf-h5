<template>
	<BasePage class="page" pageStyle="background-color:#f4f5f7;">
		<!-- 顶部导航 -->
		<template #header>
			<view class="nav">
				<u-status-bar bgColor="transparent" />
				<view class="nav-bar">
					<u-icon name="close" :size="22" color="#333333" @click="onClose" />
					<view class="nav-center">
						<text class="nav-title">收银台</text>
						<text class="nav-domain">vss.vipsave.cn</text>
					</view>
					<u-icon name="more-dot-fill" :size="22" color="#333333" />
				</view>
			</view>
		</template>

		<!-- 内容 -->
		<view class="body" v-if="info">
			<view class="amount-area">
				<view class="amount">
					<text class="amount-symbol">¥</text>
					<text class="amount-value">{{ info.amount.toFixed(2) }}</text>
				</view>
				<text class="amount-origin" v-if="info.originalAmount > info.amount">
					¥{{ info.originalAmount.toFixed(2) }}
				</text>
			</view>

			<view class="detail-card">
				<text class="detail-title">支付明细</text>
				<view class="detail-row">
					<text class="detail-label">订单金额：</text>
					<text class="detail-value">¥ {{ info.orderAmount.toFixed(2) }}</text>
				</view>
				<view class="detail-row">
					<text class="detail-label">服务费</text>
					<text class="detail-value">¥ {{ info.serviceFee.toFixed(2) }}</text>
				</view>
				<view class="detail-row" @click="onBean">
					<view class="detail-label-bean">
						<u-icon name="coupon" :size="16" color="#ff8a3d" />
						<text class="detail-label">福豆抵扣 ({{ info.beanCount }})</text>
					</view>
					<view class="detail-value-arrow">
						<text class="detail-value orange">¥ {{ info.beanDeduction.toFixed(2) }}</text>
						<u-icon name="arrow-right" :size="12" color="#c8ccd4" />
					</view>
				</view>
			</view>
		</view>

		<!-- 底部确认支付 -->
		<template #footer>
			<view class="footer">
				<view class="pay-btn" :class="{ paying }" @click="onPay">
					{{ paying ? '支付中...' : '确认支付' }}
				</view>
				<view class="safe-area" />
			</view>
		</template>
	</BasePage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import { getCashierInfo, payOrder } from '@/api/mall'
import type { CashierInfo } from '@/types/mall'

const info = ref<CashierInfo | null>(null)
const paying = ref<boolean>(false)
const orderId = ref<string>('')

onLoad((options) => {
	orderId.value = options?.itemId || 'demo-order'
	loadInfo()
})

const loadInfo = async () => {
	const res = await getCashierInfo(orderId.value)
	if (res.code === 200) info.value = res.data
}

const onClose = () => uni.navigateBack()
const onBean = () => uni.showToast({ title: '暂无可用福豆', icon: 'none' })

const onPay = async () => {
	if (paying.value) return
	paying.value = true
	uni.showLoading({ title: '支付中...' })
	try {
		const res = await payOrder(orderId.value)
		uni.hideLoading()
		if (res.code === 200 && res.data.success) {
			uni.showToast({ title: '支付成功', icon: 'success' })
			setTimeout(() => {
				uni.redirectTo({ url: '/pages/order/index?status=processing' })
			}, 1200)
		} else {
			uni.showToast({ title: '支付失败', icon: 'none' })
		}
	} catch (e) {
		uni.hideLoading()
		uni.showToast({ title: '支付异常', icon: 'none' })
	} finally {
		paying.value = false
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f4f5f7;
}
.nav {
	background: #ffffff;
}
.nav-bar {
	height: 88rpx;
	padding: 0 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.nav-center {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.nav-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a1a;
}
.nav-domain {
	font-size: 20rpx;
	color: #9aa0ab;
	margin-top: 2rpx;
}

.body {
	padding: 0 24rpx;
}
.amount-area {
	padding: 70rpx 0 50rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.amount {
	display: flex;
	align-items: baseline;
	color: #ff5a1f;
}
.amount-symbol {
	font-size: 40rpx;
	font-weight: 700;
}
.amount-value {
	font-size: 72rpx;
	font-weight: 800;
	line-height: 1;
}
.amount-origin {
	margin-top: 16rpx;
	font-size: 28rpx;
	color: #b8bcc4;
	text-decoration: line-through;
}

.detail-card {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 32rpx;
}
.detail-title {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1a1a;
	padding-bottom: 24rpx;
	border-bottom: 1rpx solid #f0f1f3;
}
.detail-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 0;
}
.detail-label {
	font-size: 28rpx;
	color: #333333;
}
.detail-label-bean {
	display: flex;
	align-items: center;
	gap: 10rpx;
}
.detail-value {
	font-size: 28rpx;
	color: #1a1a1a;
}
.detail-value.orange {
	color: #ff5a1f;
}
.detail-value-arrow {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.footer {
	background: #ffffff;
	padding: 20rpx 32rpx 0;
}
.pay-btn {
	height: 92rpx;
	border-radius: 46rpx;
	background: linear-gradient(135deg, #ff8a3d 0%, #ff5a1f 100%);
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
}
.pay-btn.paying {
	opacity: 0.7;
}
.safe-area {
	height: 20rpx;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
</style>
