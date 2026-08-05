<template>
	<BasePage class="page" pageStyle="background-color:#f4f5f7;">
		<!-- 头部：品牌 + 通知 + 头像 + 搜索（紫色渐变） -->
		<template #header>
			<view class="header">
				<u-status-bar bgColor="transparent" />
				<view class="header-bar">
					<view class="brand">
						<view class="brand-logo">
							<u-icon name="bag-fill" color="#ff6a3d" :size="18" />
						</view>
						<text class="brand-name">驰丽积分商城</text>
					</view>
					<view class="header-right">
						<u-icon name="bell" color="#ffffff" :size="22" @click="onBell" />
						<image class="header-avatar" :src="user.avatar" @click="goMe" />
					</view>
				</view>
				<!-- 可用积分行 -->
				<view class="points-row">
					<view class="points-info">
						<text class="points-label">当前可用积分</text>
						<view class="points-value">
							<text class="points-num">{{ formatNum(user.points) }}</text>
							<text class="points-unit">积分</text>
						</view>
					</view>
					<view class="recharge-btn" @click="onPointsDetail">
						<u-icon name="list-dot" color="#ff6a3d" :size="15" />
						<text class="recharge-text">查看明细</text>
					</view>
				</view>
				<!-- 搜索栏 -->
				<view class="search-bar">
					<view class="search-input">
						<u-icon name="search" color="#9aa0ab" :size="16" />
						<input
							v-model="keyword"
							class="search-field"
							type="text"
							placeholder="搜索话费 / 红包 / 卡券"
							placeholder-class="search-ph"
							confirm-type="search"
							@confirm="onSearch"
						/>
					</view>
					<view class="search-btn" @click="onSearch">搜索</view>
				</view>
			</view>
		</template>

		<!-- 内容 -->
		<view class="body">
			<!-- Banner 轮播 -->
			<swiper
				v-if="banners.length"
				class="banner"
				:autoplay="true"
				:interval="3500"
				:duration="450"
				:circular="true"
				indicator-dots
				indicator-active-color="#ffffff"
				indicator-color="rgba(255,255,255,0.45)"
			>
				<swiper-item v-for="b in banners" :key="b.id">
					<view class="banner-slide" :style="{ background: b.bg }" @click="onBanner(b)">
						<view class="banner-text">
							<text class="banner-title">{{ b.title }}</text>
							<text class="banner-sub">{{ b.subtitle }}</text>
							<view class="banner-tag">立即查看</view>
						</view>
						<text class="banner-emoji">{{ b.emoji }}</text>
					</view>
				</swiper-item>
			</swiper>

			<!-- 金刚区 -->
			<view class="kingkong">
				<view
					v-for="nav in kingKong"
					:key="nav.key"
					class="kk-item"
					@click="onKingKong(nav)"
				>
					<view class="kk-icon" :style="{ background: nav.color }">
						<u-icon :name="nav.icon" color="#ffffff" :size="22" />
					</view>
					<text class="kk-label">{{ nav.label }}</text>
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

			<!-- 分类商品板块 -->
			<view v-for="cat in displayCategories" :key="cat.key" class="category">
				<view class="cat-head">
					<view class="cat-title-wrap">
						<view class="cat-icon" :style="{ background: cat.color }">
							<u-icon :name="cat.icon" color="#ffffff" :size="18" />
						</view>
						<view class="cat-title-text">
							<text class="cat-title">{{ cat.title }}</text>
							<text class="cat-sub">{{ cat.subtitle }}</text>
						</view>
					</view>
					<view class="section-more" @click="onCategoryMore(cat)">
						<text>全部</text>
						<u-icon name="arrow-right" color="#9aa0ab" :size="12" />
					</view>
				</view>
				<view class="product-grid">
					<view
						v-for="p in cat.products"
						:key="p.id"
						class="product-card"
						@click="onProduct(p)"
					>
						<view class="p-logo" :style="{ background: p.color }">
							<text v-if="p.tag" class="p-tag">{{ p.tag }}</text>
							<text class="p-face">{{ p.face }}</text>
							<text class="p-brand">{{ p.brand }}</text>
						</view>
						<text class="p-name">{{ p.name }}</text>
						<view class="p-bottom">
							<view class="p-points">
								<text class="p-points-num">{{ formatNum(p.points) }}</text>
								<text class="p-points-unit">积分</text>
							</view>
							<view class="p-btn">兑换</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 搜索无结果 -->
			<view v-if="keyword && !displayCategories.length" class="empty">
				<u-icon name="empty-search" color="#c8ccd4" :size="60" />
				<text class="empty-text">没有找到「{{ keyword }}」相关商品</text>
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import { getHomeData } from '@/api/mall'
import type { Banner, MallActivity, MallProduct, MallUser, ProductCategory, QuickNav } from '@/types/mall'

const user = ref<MallUser>({ nickname: '', avatar: '/static/mall-avatar.png', phone: '', points: 0 })
const banners = ref<Banner[]>([])
const kingKong = ref<QuickNav[]>([])
const activities = ref<MallActivity[]>([])
const categories = ref<ProductCategory[]>([])
const keyword = ref('')

const formatNum = (n: number) => n.toLocaleString('en-US')

const displayCategories = computed<ProductCategory[]>(() => {
	const kw = keyword.value.trim()
	if (!kw) return categories.value
	return categories.value
		.map((c) => ({ ...c, products: c.products.filter((p) => p.name.includes(kw) || c.title.includes(kw)) }))
		.filter((c) => c.products.length > 0)
})

const loadData = async () => {
	const res = await getHomeData()
	if (res.code === 200) {
		user.value = res.data.user
		banners.value = res.data.banners
		kingKong.value = res.data.kingKong
		activities.value = res.data.activities
		categories.value = res.data.categories
	}
}

onLoad(() => {
	loadData()
})

const goMe = () => uni.switchTab({ url: '/pages/me/index' })
const onBell = () => uni.showToast({ title: '暂无新通知', icon: 'none' })
const onPointsDetail = () => uni.showToast({ title: '积分明细开发中', icon: 'none' })
const onSearch = () => {
	if (!keyword.value.trim()) {
		uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
	}
}
const onBanner = (b: Banner) => uni.showToast({ title: b.title, icon: 'none' })
const onMore = () => uni.showToast({ title: '查看更多活动', icon: 'none' })
const onActivity = (act: MallActivity) => uni.showToast({ title: act.title, icon: 'none' })

/** 金刚区入口 -> 分类 key 映射 */
const KK_CATEGORY_MAP: Record<string, string> = {
	recharge: 'recharge',
	oil: 'recharge',
	lijianjin: 'redpacket',
	redpacket: 'redpacket',
	payment: 'payment',
	tmall: 'prepaid',
	jd: 'prepaid',
	hema: 'prepaid',
	integral: 'all',
	more: 'all'
}

const goCategory = (key: string, title: string) => {
	uni.navigateTo({ url: `/pages/category/index?key=${key}&title=${encodeURIComponent(title)}` })
}
const onKingKong = (nav: QuickNav) => {
	const catKey = KK_CATEGORY_MAP[nav.key] ?? 'all'
	goCategory(catKey, catKey === 'all' ? '全部商品' : nav.label)
}
const onCategoryMore = (cat: ProductCategory) => goCategory(cat.key, cat.title)
const onProduct = (p: MallProduct) => {
	uni.navigateTo({ url: `/pages/cashier/index?itemId=${p.id}&name=${encodeURIComponent(p.name)}` })
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f4f5f7;
}

.header {
	background: linear-gradient(135deg, #ffa14a 0%, #ff6a3d 100%);
	padding: 16rpx 0 30rpx;
	border-radius: 0 0 40rpx 40rpx;
}
.header-bar {
	height: 84rpx;
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

.search-bar {
	margin: 8rpx 32rpx 0;
	display: flex;
	align-items: center;
	gap: 16rpx;
}
.search-input {
	flex: 1;
	height: 68rpx;
	background: #ffffff;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	gap: 12rpx;
}
.search-field {
	flex: 1;
	font-size: 26rpx;
	color: #333333;
}
.search-ph {
	color: #b6bac2;
	font-size: 26rpx;
}
.search-btn {
	color: #ffffff;
	font-size: 28rpx;
	font-weight: 600;
	padding: 0 6rpx;
}

.body {
	padding: 0 24rpx 40rpx;
}

.points-row {
	margin: 20rpx 32rpx 4rpx;
	padding: 24rpx 30rpx;
	background: rgba(255, 255, 255, 0.16);
	border: 2rpx solid rgba(255, 255, 255, 0.28);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.points-label {
	color: rgba(255, 255, 255, 0.9);
	font-size: 24rpx;
}
.points-value {
	margin-top: 8rpx;
	display: flex;
	align-items: baseline;
}
.points-num {
	color: #ffffff;
	font-size: 56rpx;
	font-weight: 800;
	line-height: 1;
}
.points-unit {
	color: rgba(255, 255, 255, 0.9);
	font-size: 24rpx;
	margin-left: 10rpx;
}
.recharge-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background: #ffffff;
	padding: 14rpx 28rpx;
	border-radius: 40rpx;
	box-shadow: 0 8rpx 20rpx rgba(180, 60, 20, 0.18);
}
.recharge-text {
	color: #ff6a3d;
	font-size: 26rpx;
	font-weight: 700;
}

.banner {
	margin-top: 24rpx;
	height: 220rpx;
	border-radius: 24rpx;
	overflow: hidden;
}
.banner-slide {
	height: 220rpx;
	border-radius: 24rpx;
	padding: 32rpx 36rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}
.banner-text {
	display: flex;
	flex-direction: column;
}
.banner-title {
	color: #ffffff;
	font-size: 38rpx;
	font-weight: 800;
}
.banner-sub {
	color: rgba(255, 255, 255, 0.9);
	font-size: 24rpx;
	margin-top: 12rpx;
}
.banner-tag {
	align-self: flex-start;
	margin-top: 22rpx;
	background: rgba(255, 255, 255, 0.28);
	color: #ffffff;
	font-size: 22rpx;
	padding: 8rpx 24rpx;
	border-radius: 30rpx;
}
.banner-emoji {
	font-size: 96rpx;
}

.kingkong {
	margin-top: 28rpx;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 32rpx 8rpx 12rpx;
	display: flex;
	flex-wrap: wrap;
}
.kk-item {
	width: 20%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14rpx;
	margin-bottom: 28rpx;
}
.kk-icon {
	width: 82rpx;
	height: 82rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.kk-label {
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

.category {
	margin-top: 40rpx;
}
.cat-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.cat-title-wrap {
	display: flex;
	align-items: center;
	gap: 16rpx;
}
.cat-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.cat-title-text {
	display: flex;
	flex-direction: column;
}
.cat-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1a1a;
}
.cat-sub {
	font-size: 22rpx;
	color: #9aa0ab;
	margin-top: 4rpx;
}

.product-grid {
	margin-top: 24rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.product-card {
	width: 340rpx;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-sizing: border-box;
	box-shadow: 0 8rpx 24rpx rgba(20, 20, 40, 0.05);
}
.p-logo {
	position: relative;
	height: 160rpx;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
}
.p-tag {
	position: absolute;
	top: 0;
	right: 0;
	background: #ffd84d;
	color: #7a4b00;
	font-size: 18rpx;
	font-weight: 700;
	padding: 4rpx 14rpx;
	border-radius: 0 16rpx 0 16rpx;
}
.p-face {
	color: #ffffff;
	font-size: 46rpx;
	font-weight: 800;
}
.p-brand {
	color: rgba(255, 255, 255, 0.95);
	font-size: 22rpx;
	letter-spacing: 1rpx;
}
.p-name {
	display: block;
	margin-top: 16rpx;
	font-size: 26rpx;
	color: #1a1a1a;
	font-weight: 600;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.p-bottom {
	margin-top: 14rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.p-points {
	display: flex;
	align-items: baseline;
}
.p-points-num {
	color: #ff5e62;
	font-size: 30rpx;
	font-weight: 800;
}
.p-points-unit {
	color: #ff5e62;
	font-size: 20rpx;
	margin-left: 4rpx;
}
.p-btn {
	background: linear-gradient(135deg, #ffa14a 0%, #ff6a3d 100%);
	color: #ffffff;
	font-size: 24rpx;
	padding: 10rpx 26rpx;
	border-radius: 30rpx;
}

.empty {
	margin-top: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}
.empty-text {
	font-size: 26rpx;
	color: #9aa0ab;
}
</style>
