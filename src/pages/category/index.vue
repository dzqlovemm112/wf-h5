<template>
	<BasePage class="page" pageStyle="background-color:#f4f5f7;">
		<!-- 顶部导航 -->
		<template #header>
			<u-navbar :title="navTitle" :placeholder="true" border="bottom" @leftClick="goBack" />
		</template>

		<!-- 内容 -->
		<view class="body">
			<view v-if="list.length">
				<view v-for="cat in list" :key="cat.key" class="category">
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
			</view>

			<view v-else class="empty">
				<u-icon name="empty-search" color="#c8ccd4" :size="60" />
				<text class="empty-text">暂无相关商品</text>
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import { goBack } from '@/utils'
import { getCategories, getCategory } from '@/api/mall'
import type { MallProduct, ProductCategory } from '@/types/mall'

const list = ref<ProductCategory[]>([])
const title = ref('')

const navTitle = computed(() => title.value || (list.value.length === 1 ? list.value[0].title : '商品分类'))

const formatNum = (n: number) => n.toLocaleString('en-US')

const loadData = async (key: string) => {
	if (!key || key === 'all') {
		const res = await getCategories()
		if (res.code === 200) list.value = res.data
		return
	}
	const res = await getCategory(key)
	if (res.code === 200 && res.data) list.value = [res.data]
}

onLoad((options) => {
	const key = options?.key ?? 'all'
	title.value = options?.title ? decodeURIComponent(options.title) : ''
	loadData(key)
})

const onProduct = (p: MallProduct) => {
	uni.navigateTo({ url: `/pages/cashier/index?itemId=${p.id}&name=${encodeURIComponent(p.name)}` })
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #f4f5f7;
}
.body {
	padding: 24rpx 30rpx 60rpx;
}

.category {
	margin-bottom: 20rpx;
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
	margin-top: 120rpx;
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
