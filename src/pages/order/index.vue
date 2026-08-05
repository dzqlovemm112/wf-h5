<template>
	<BasePage class="page" pageStyle="background-color:#f4f5f7;">
		<!-- 顶部导航 -->
		<template #header>
			<u-navbar title="兑换订单" :placeholder="true" border="bottom" @leftClick="goBack" />
			<!-- 状态筛选 -->
			<view class="tabs">
				<view
					v-for="tab in tabs"
					:key="tab.key"
					class="tab"
					:class="{ active: current === tab.key }"
					@click="switchTab(tab.key)"
				>
					<text>{{ tab.label }}</text>
					<view class="tab-line" v-if="current === tab.key" />
				</view>
			</view>
		</template>

		<!-- 订单列表 -->
		<view class="body">
			<view v-if="orders.length" class="order-list">
				<view v-for="order in orders" :key="order.id" class="order-item">
					<view class="order-head">
						<text class="order-time">{{ order.createdAt }}</text>
						<text class="order-status" :style="{ color: statusColor(order.status) }">
							{{ statusText(order.status) }}
						</text>
					</view>
					<view class="order-body">
						<view class="order-logo" :style="{ background: order.color }">
							<text class="order-brand">{{ order.brand }}</text>
						</view>
						<view class="order-info">
							<text class="order-name">{{ order.itemName }}</text>
							<text class="order-points">-{{ order.points }} 积分</text>
						</view>
					</view>
					<view class="order-foot">
						<view class="order-btn ghost" @click="onDetail(order)">订单详情</view>
						<view
							v-if="order.status === 'failed' || order.status === 'abnormal'"
							class="order-btn primary"
							@click="onRetry(order)"
						>
							重新兑换
						</view>
					</view>
				</view>
			</view>

			<view v-else class="empty">
				<u-icon name="list" :size="60" color="#d4d7dd" />
				<text class="empty-text">暂无相关订单</text>
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import { goBack } from '@/utils'
import { getOrders, getOrderStatusText } from '@/api/mall'
import type { MallOrder, OrderStatus } from '@/types/mall'

type TabKey = 'all' | OrderStatus

const tabs: { key: TabKey; label: string }[] = [
	{ key: 'all', label: '全部' },
	{ key: 'processing', label: '处理中' },
	{ key: 'done', label: '已完成' },
	{ key: 'failed', label: '兑换失败' },
	{ key: 'abnormal', label: '兑换异常' }
]

const current = ref<TabKey>('all')
const orders = ref<MallOrder[]>([])

const statusText = (s: OrderStatus) => getOrderStatusText(s)
const statusColor = (s: OrderStatus) => {
	const map: Record<OrderStatus, string> = {
		processing: '#ff8a3d',
		done: '#22c55e',
		failed: '#ff4d4f',
		abnormal: '#ff4d4f'
	}
	return map[s]
}

const loadOrders = async () => {
	const status = current.value === 'all' ? undefined : current.value
	const res = await getOrders(status)
	if (res.code === 200) orders.value = res.data
}

const switchTab = (key: TabKey) => {
	current.value = key
	loadOrders()
}

onLoad((options) => {
	if (options?.status) {
		current.value = options.status as TabKey
	}
	loadOrders()
})

const onDetail = (order: MallOrder) => uni.showToast({ title: '订单：' + order.id, icon: 'none' })
const onRetry = (order: MallOrder) => {
	uni.navigateTo({ url: `/pages/cashier/index?itemId=${order.id}&name=${encodeURIComponent(order.itemName)}` })
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f4f5f7;
}
.tabs {
	background: #ffffff;
	display: flex;
	padding: 0 16rpx;
	border-bottom: 1rpx solid #f0f1f3;
}
.tab {
	flex: 1;
	height: 84rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #666666;
	position: relative;
}
.tab.active {
	color: #ff6a3d;
	font-weight: 600;
}
.tab-line {
	position: absolute;
	bottom: 0;
	width: 40rpx;
	height: 6rpx;
	border-radius: 4rpx;
	background: #ff6a3d;
}

.body {
	padding: 24rpx;
}
.order-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.order-item {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx;
}
.order-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f5f6f8;
}
.order-time {
	font-size: 24rpx;
	color: #9aa0ab;
}
.order-status {
	font-size: 26rpx;
	font-weight: 600;
}
.order-body {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx 0;
}
.order-logo {
	width: 96rpx;
	height: 96rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.order-brand {
	color: #ffffff;
	font-size: 22rpx;
	font-weight: 700;
	text-align: center;
	padding: 0 6rpx;
}
.order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}
.order-name {
	font-size: 28rpx;
	color: #1a1a1a;
	font-weight: 500;
}
.order-points {
	font-size: 26rpx;
	color: #ff5a1f;
	font-weight: 600;
}
.order-foot {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
	padding-top: 8rpx;
}
.order-btn {
	font-size: 26rpx;
	padding: 12rpx 32rpx;
	border-radius: 40rpx;
}
.order-btn.ghost {
	border: 1rpx solid #d4d7dd;
	color: #666666;
}
.order-btn.primary {
	background: linear-gradient(135deg, #ffa14a 0%, #ff6a3d 100%);
	color: #ffffff;
}

.empty {
	padding-top: 180rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
}
.empty-text {
	font-size: 26rpx;
	color: #9aa0ab;
}
</style>
