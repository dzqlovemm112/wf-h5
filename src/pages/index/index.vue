<template>
	<BasePage class="page" pageStyle="background-color:#f4f5f7;">
		<!-- 头部：品牌 + 通知 + 头像（紫色渐变） -->
		<template #header>
			<view class="header">
				<u-status-bar bgColor="transparent" />
				<view class="header-bar">
					<view class="brand">
						<view class="brand-logo">
							<u-icon name="bag" color="#6A5AE0" :size="18" />
						</view>
						<text class="brand-name">驰丽积分商城</text>
					</view>
					<view class="header-right">
						<u-icon name="bell" color="#ffffff" :size="22" @click="onBell" />
						<image class="header-avatar" :src="user.avatar" @click="goMe" />
					</view>
				</view>
			</view>
		</template>

		<!-- 内容 -->
		<view class="body">
			<!-- 积分卡片 -->
			<view class="points-card">
				<view class="points-info">
					<text class="points-label">当前可用积分</text>
					<view class="points-value">
						<text class="points-num">{{ formatNum(user.points) }}</text>
						<text class="points-unit">积分</text>
					</view>
				</view>
				<view class="recharge-btn" @click="onRecharge">去充值</view>
			</view>

			<!-- 快捷入口 -->
			<view class="quick-nav">
				<view
					v-for="nav in quickNavs"
					:key="nav.key"
					class="quick-item"
					@click="onQuickNav(nav)"
				>
					<view class="quick-icon" :style="{ background: nav.color }">
						<u-icon :name="nav.icon" color="#ffffff" :size="20" />
					</view>
					<text class="quick-label">{{ nav.label }}</text>
				</view>
			</view>

			<!-- 商城活动 -->
			<view class="section">
				<text class="section-title">商城活动</text>
				<view class="section-more" @click="onMore">
					<text>查看更多</text>
					<u-icon name="arrow-right" color="#9aa0ab" :size="12" />
				</view>
			</view>
			<view class="activities" v-if="activities.length">
				<view class="act-big" :style="{ background: activities[0].bg }" @click="onActivity(activities[0])">
					<text class="act-emoji">{{ activities[0].emoji }}</text>
					<text class="act-title">{{ activities[0].title }}</text>
					<text class="act-sub">{{ activities[0].subtitle }}</text>
					<view class="act-btn">点击进入</view>
				</view>
				<view class="act-col">
					<view
						v-for="act in activities.slice(1)"
						:key="act.id"
						class="act-small"
						:style="{ background: act.bg }"
						@click="onActivity(act)"
					>
						<view class="act-small-text">
							<text class="act-title">{{ act.title }}</text>
							<text class="act-sub">{{ act.subtitle }}</text>
						</view>
						<text class="act-emoji-sm">{{ act.emoji }}</text>
					</view>
				</view>
			</view>

			<!-- 热门兑换 -->
			<view class="section">
				<text class="section-title">热门兑换</text>
			</view>
			<view class="exchange-grid">
				<view v-for="item in exchangeItems" :key="item.id" class="ex-card">
					<view class="ex-logo" :style="{ background: item.color }">
						<text class="ex-brand">{{ item.brand }}</text>
					</view>
					<text class="ex-name">{{ item.name }}</text>
					<view class="ex-bottom">
						<text class="ex-points">最低{{ item.minPoints }}积分起可兑换</text>
						<view class="ex-btn" @click="onExchange(item)">立即兑换</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部 tab -->
		<template #footer>
			<TabBar :current="0" />
		</template>
	</BasePage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import TabBar from '@/components/mall/TabBar.vue'
import { getHomeData } from '@/api/mall'
import type { ExchangeItem, MallActivity, MallUser, QuickNav } from '@/types/mall'

const user = ref<MallUser>({ nickname: '', avatar: '/static/mall-avatar.png', phone: '', points: 0 })
const quickNavs = ref<QuickNav[]>([])
const activities = ref<MallActivity[]>([])
const exchangeItems = ref<ExchangeItem[]>([])

const formatNum = (n: number) => n.toLocaleString('en-US')

const loadData = async () => {
	const res = await getHomeData()
	if (res.code === 200) {
		user.value = res.data.user
		quickNavs.value = res.data.quickNavs
		activities.value = res.data.activities
		exchangeItems.value = res.data.exchangeItems
	}
}

onLoad(() => {
	loadData()
})

const goMe = () => uni.reLaunch({ url: '/pages/me/index' })
const onBell = () => uni.showToast({ title: '暂无新通知', icon: 'none' })
const onRecharge = () => uni.showToast({ title: '充值功能开发中', icon: 'none' })
const onMore = () => uni.showToast({ title: '查看更多活动', icon: 'none' })
const onActivity = (act: MallActivity) => uni.showToast({ title: act.title, icon: 'none' })
const onQuickNav = (nav: QuickNav) => {
	if (nav.key === 'lijianjin') {
		uni.showToast({ title: '立减金', icon: 'none' })
		return
	}
	uni.showToast({ title: nav.label, icon: 'none' })
}
const onExchange = (item: ExchangeItem) => {
	uni.navigateTo({ url: `/pages/cashier/index?itemId=${item.id}&name=${encodeURIComponent(item.name)}` })
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f4f5f7;
}

.header {
	background: linear-gradient(135deg, #7b5cff 0%, #6a5ae0 100%);
	padding-bottom: 140rpx;
}
.header-bar {
	height: 88rpx;
	padding: 0 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.brand {
	display: flex;
	align-items: center;
	gap: 14rpx;
}
.brand-logo {
	width: 48rpx;
	height: 48rpx;
	border-radius: 14rpx;
	background: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.brand-name {
	color: #ffffff;
	font-size: 34rpx;
	font-weight: 600;
}
.header-right {
	display: flex;
	align-items: center;
	gap: 24rpx;
}
.header-avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	border: 2rpx solid rgba(255, 255, 255, 0.6);
}

.body {
	padding: 0 24rpx 40rpx;
}

.points-card {
	margin-top: -110rpx;
	background: linear-gradient(135deg, #8b6bff 0%, #6a5ae0 100%);
	border-radius: 24rpx;
	padding: 40rpx 36rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 16rpx 40rpx rgba(106, 90, 224, 0.35);
}
.points-label {
	color: rgba(255, 255, 255, 0.85);
	font-size: 26rpx;
}
.points-value {
	margin-top: 14rpx;
	display: flex;
	align-items: baseline;
}
.points-num {
	color: #ffffff;
	font-size: 64rpx;
	font-weight: 700;
	line-height: 1;
}
.points-unit {
	color: #ffffff;
	font-size: 26rpx;
	margin-left: 10rpx;
}
.recharge-btn {
	background: rgba(255, 255, 255, 0.9);
	color: #6a5ae0;
	font-size: 26rpx;
	font-weight: 600;
	padding: 14rpx 28rpx;
	border-radius: 40rpx;
}

.quick-nav {
	margin-top: 28rpx;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 32rpx 12rpx;
	display: flex;
	justify-content: space-between;
}
.quick-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14rpx;
}
.quick-icon {
	width: 84rpx;
	height: 84rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.quick-label {
	font-size: 24rpx;
	color: #333333;
}

.section {
	margin-top: 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.section-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #1a1a1a;
}
.section-more {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 24rpx;
	color: #9aa0ab;
}

.activities {
	margin-top: 24rpx;
	display: flex;
	gap: 20rpx;
}
.act-big {
	width: 320rpx;
	border-radius: 24rpx;
	padding: 28rpx;
	display: flex;
	flex-direction: column;
	color: #ffffff;
}
.act-emoji {
	font-size: 56rpx;
}
.act-emoji-sm {
	font-size: 44rpx;
}
.act-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #ffffff;
	margin-top: 8rpx;
}
.act-sub {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.85);
	margin-top: 8rpx;
}
.act-btn {
	align-self: flex-start;
	margin-top: 20rpx;
	background: rgba(255, 255, 255, 0.25);
	color: #ffffff;
	font-size: 22rpx;
	padding: 8rpx 22rpx;
	border-radius: 30rpx;
}
.act-col {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.act-small {
	flex: 1;
	border-radius: 24rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.act-small-text {
	display: flex;
	flex-direction: column;
}

.exchange-grid {
	margin-top: 24rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.ex-card {
	width: 340rpx;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-sizing: border-box;
}
.ex-logo {
	height: 150rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.ex-brand {
	color: #ffffff;
	font-size: 34rpx;
	font-weight: 800;
	letter-spacing: 2rpx;
}
.ex-name {
	display: block;
	margin-top: 18rpx;
	font-size: 28rpx;
	color: #1a1a1a;
	font-weight: 600;
}
.ex-bottom {
	margin-top: 14rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.ex-points {
	font-size: 20rpx;
	color: #9aa0ab;
}
.ex-btn {
	background: linear-gradient(135deg, #7b5cff 0%, #6a5ae0 100%);
	color: #ffffff;
	font-size: 22rpx;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
}
</style>
