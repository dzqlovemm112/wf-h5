<template>
	<BasePage class="page" pageStyle="background-color:#f4f5f7;">
		<!-- 内容 -->
		<view class="body">
			<!-- 个人信息头部（紫色渐变） -->
			<view class="header">
				<u-status-bar bgColor="transparent" />
				<view class="header-top">
					<text class="header-title">个人中心</text>
					<view class="header-icons">
						<u-icon name="bell" color="#ffffff" :size="22" @click="onBell" />
						<u-icon name="setting" color="#ffffff" :size="22" @click="onSetting" />
					</view>
				</view>
				<view class="profile" @click="onProfile">
					<image class="avatar" :src="user.avatar" />
					<view class="profile-info">
						<text class="nickname">{{ loggedIn ? user.nickname : '点击登录 / 注册' }}</text>
						<text class="phone" v-if="loggedIn">绑定手机号：{{ user.phone }}</text>
						<text class="phone" v-else>登录后享更多积分权益</text>
					</view>
				</view>

				<!-- 可用积分卡 -->
				<view class="points-card">
					<view class="points-left">
						<text class="points-label">可用积分</text>
						<text class="points-num">{{ formatNum(user.points) }}</text>
					</view>
					<view class="points-detail" @click="onPointsDetail">
						<text>查看明细</text>
						<u-icon name="arrow-right" color="#9aa0ab" :size="12" />
					</view>
				</view>
			</view>

			<!-- 卡密兑换积分 -->
			<view class="card-key" @click="onCardKey">
				<view class="ck-icon">
					<u-icon name="gift" color="#ffffff" :size="22" />
				</view>
				<view class="ck-text">
					<text class="ck-title">卡密兑换积分</text>
					<text class="ck-sub">输入虚拟卡密快速兑换积分</text>
				</view>
				<view class="ck-btn">去兑换</view>
			</view>

			<!-- 兑换订单 -->
			<view class="orders-card">
				<view class="orders-head">
					<text class="orders-title">兑换订单</text>
					<view class="orders-all" @click="goOrders()">
						<text>全部订单</text>
						<u-icon name="arrow-right" color="#9aa0ab" :size="12" />
					</view>
				</view>
				<view class="orders-status">
					<view
						v-for="st in statusList"
						:key="st.key"
						class="status-item"
						@click="goOrders(st.key)"
					>
						<view class="status-icon-wrap">
							<u-icon :name="st.icon" color="#ff6a3d" :size="26" />
							<view v-if="statusCount[st.key] > 0" class="status-badge">
								{{ statusCount[st.key] }}
							</view>
						</view>
						<text class="status-text">{{ st.label }}</text>
					</view>
				</view>
			</view>

			<!-- 常用功能 -->
			<view class="func-card">
				<text class="func-title">常用功能</text>
				<view
					v-for="(func, idx) in funcs"
					:key="func.key"
					class="func-item"
					:class="{ 'no-border': idx === funcs.length - 1 }"
					@click="onFunc(func)"
				>
					<view class="func-left">
						<u-icon :name="func.icon" color="#ff6a3d" :size="20" />
						<text class="func-name">{{ func.label }}</text>
					</view>
					<u-icon name="arrow-right" color="#c8ccd4" :size="14" />
				</view>
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import { getUserInfo } from '@/api/mall'
import { isLogin } from '@/components/dzq-auth/authTool'
import type { MallUser, OrderStatus } from '@/types/mall'
import { getOrderStatusCount } from '@/api/mall'

const user = ref<MallUser>({ nickname: '', avatar: '/static/mall-avatar.png', phone: '', points: 0 })
const loggedIn = ref<boolean>(false)
const statusCount = ref<Record<OrderStatus, number>>({ processing: 0, done: 0, failed: 0, abnormal: 0 })

const statusList: { key: OrderStatus; label: string; icon: string }[] = [
	{ key: 'processing', label: '处理中', icon: 'reload' },
	{ key: 'done', label: '已完成', icon: 'checkmark-circle' },
	{ key: 'failed', label: '兑换失败', icon: 'close-circle' },
	{ key: 'abnormal', label: '兑换异常', icon: 'error-circle' }
]

const funcs = [
	{ key: 'cardRecord', label: '卡密兑换记录', icon: 'order' },
	{ key: 'pointsDetail', label: '积分明细', icon: 'rmb-circle' },
	{ key: 'faq', label: '常见问题', icon: 'question-circle' },
	{ key: 'service', label: '联系客服', icon: 'kefu-ermai' }
]

const formatNum = (n: number) => n.toLocaleString('en-US')

const loadData = async () => {
	loggedIn.value = isLogin()
	const [u, c] = await Promise.all([getUserInfo(), getOrderStatusCount()])
	if (u.code === 200) user.value = u.data
	if (c.code === 200) statusCount.value = c.data
}

onShow(() => {
	loadData()
})

const goLogin = () => uni.navigateTo({ url: '/pages/user/login' })
const onProfile = () => {
	if (!loggedIn.value) goLogin()
}
const onBell = () => uni.showToast({ title: '暂无新通知', icon: 'none' })
const onSetting = () => uni.showToast({ title: '设置', icon: 'none' })
const onPointsDetail = () => uni.showToast({ title: '积分明细', icon: 'none' })
const onCardKey = () => uni.showToast({ title: '卡密兑换', icon: 'none' })
const goOrders = (status?: OrderStatus) => {
	const q = status ? `?status=${status}` : ''
	uni.navigateTo({ url: `/pages/order/index${q}` })
}
const onFunc = (func: { key: string; label: string }) => {
	if (func.key === 'pointsDetail') {
		uni.showToast({ title: '积分明细', icon: 'none' })
		return
	}
	uni.showToast({ title: func.label, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f4f5f7;
}
.body {
	padding-bottom: 40rpx;
}

.header {
	background: linear-gradient(135deg, #ffa14a 0%, #ff6a3d 100%);
	padding: 0 32rpx 90rpx;
}
.header-top {
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.header-title {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
}
.header-icons {
	display: flex;
	align-items: center;
	gap: 28rpx;
}
.profile {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-top: 10rpx;
}
.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.5);
}
.profile-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}
.nickname {
	color: #ffffff;
	font-size: 38rpx;
	font-weight: 700;
}
.phone {
	color: rgba(255, 255, 255, 0.85);
	font-size: 24rpx;
}

.points-card {
	margin-top: 36rpx;
	background: rgba(255, 255, 255, 0.16);
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.points-left {
	display: flex;
	align-items: baseline;
	gap: 20rpx;
}
.points-label {
	color: #ffffff;
	font-size: 28rpx;
}
.points-num {
	color: #ffffff;
	font-size: 44rpx;
	font-weight: 700;
}
.points-detail {
	display: flex;
	align-items: center;
	gap: 6rpx;
	background: #ffffff;
	color: #ff6a3d;
	font-size: 22rpx;
	padding: 8rpx 18rpx;
	border-radius: 30rpx;
}
.points-detail .u-icon {
	color: #ff6a3d;
}

.card-key {
	margin: -60rpx 24rpx 0;
	background: linear-gradient(135deg, #ffb35b 0%, #ff8a3d 100%);
	border-radius: 20rpx;
	padding: 28rpx 32rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 12rpx 30rpx rgba(255, 138, 61, 0.3);
}
.ck-icon {
	width: 68rpx;
	height: 68rpx;
	border-radius: 18rpx;
	background: rgba(255, 255, 255, 0.25);
	display: flex;
	align-items: center;
	justify-content: center;
}
.ck-text {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}
.ck-title {
	color: #ffffff;
	font-size: 30rpx;
	font-weight: 700;
}
.ck-sub {
	color: rgba(255, 255, 255, 0.9);
	font-size: 22rpx;
}
.ck-btn {
	background: #ffffff;
	color: #ff8a3d;
	font-size: 26rpx;
	font-weight: 600;
	padding: 14rpx 28rpx;
	border-radius: 40rpx;
}

.orders-card {
	margin: 24rpx 24rpx 0;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 28rpx 24rpx;
}
.orders-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.orders-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1a1a;
}
.orders-all {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 24rpx;
	color: #9aa0ab;
}
.orders-status {
	margin-top: 32rpx;
	display: flex;
	justify-content: space-between;
}
.status-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14rpx;
}
.status-icon-wrap {
	position: relative;
}
.status-badge {
	position: absolute;
	top: -10rpx;
	right: -16rpx;
	min-width: 28rpx;
	height: 28rpx;
	padding: 0 6rpx;
	box-sizing: border-box;
	background: #ff4d4f;
	color: #ffffff;
	font-size: 18rpx;
	line-height: 28rpx;
	text-align: center;
	border-radius: 14rpx;
}
.status-text {
	font-size: 24rpx;
	color: #555555;
}

.func-card {
	margin: 24rpx 24rpx 0;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 12rpx 28rpx;
}
.func-title {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
	color: #1a1a1a;
	padding: 20rpx 0;
}
.func-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 0;
	border-bottom: 1rpx solid #f0f1f3;
}
.func-item.no-border {
	border-bottom: none;
}
.func-left {
	display: flex;
	align-items: center;
	gap: 18rpx;
}
.func-name {
	font-size: 28rpx;
	color: #333333;
}
</style>
