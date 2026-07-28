<template>
	<view class="tabbar">
		<view class="tabbar-inner">
			<view
				v-for="(item, index) in tabs"
				:key="item.path"
				class="tab-item"
				:class="{ active: index === current }"
				@click="switchTab(index, item.path)"
			>
				<u-icon
					:name="item.icon"
					:size="22"
					:color="index === current ? activeColor : '#9aa0ab'"
				/>
				<text class="tab-text" :style="{ color: index === current ? activeColor : '#9aa0ab' }">
					{{ item.text }}
				</text>
			</view>
		</view>
		<view class="safe-area" />
	</view>
</template>

<script lang="ts" setup>
interface Props {
	current: number
}
withDefaults(defineProps<Props>(), { current: 0 })

const activeColor = '#6A5AE0'

const tabs = [
	{ text: '首页', icon: 'home', path: '/pages/index/index' },
	{ text: '我的', icon: 'account', path: '/pages/me/index' }
]

const switchTab = (index: number, path: string) => {
	if (index === undefined) return
	uni.reLaunch({ url: path })
}
</script>

<style lang="scss" scoped>
.tabbar {
	background: #ffffff;
	box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.05);
}
.tabbar-inner {
	display: flex;
	height: 100rpx;
}
.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
}
.tab-text {
	font-size: 22rpx;
}
.safe-area {
	height: constant(safe-area-inset-bottom);
	height: env(safe-area-inset-bottom);
}
</style>
