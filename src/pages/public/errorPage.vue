<template>
	<BasePage class="page">
		<template #header>
			<u-navbar :title="title" :placeholder="true" border="bottom" @leftClick="goBack" />
		</template>
		<view class="body">
			<image class="logo" src="/static/syserror.jpg"></image>
			<view class="text-area">
				{{ title }}
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import BasePage from '@/components/base-page/index.vue';
import { goBack } from '@/utils'
const title = ref<string>('')

onLoad((options) => {
	const { msg } = options || {}
	title.value = msg || '参数异常，请联系客服！'
})

</script>

<style lang="scss" scoped>
.body {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 500rpx;
	width: 500rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	word-break: break-all;
	width: 80%;
	font-size: 30rpx;
	color: #8f8f94;
	text-align: center;
}
</style>
