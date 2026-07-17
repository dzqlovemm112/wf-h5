<template>
	<BasePage>
		<!-- 头部  -->
		<template #header>
			<u-navbar title="我的" :placeholder="true" border="bottom" leftIcon="" />
		</template>

		<!-- 内容 -->
		<view class="body">
			<view class="login-btn">
				<u-button type="primary" @click="login">登录</u-button>
			</view>
		</view>

		<!-- 底部 -->
		<template #footer>
			<view class="footer">
				<u-tabbar :value="1">
					<u-tabbar-item text="首页" icon="home" @click="changeTab"></u-tabbar-item>
					<u-tabbar-item text="我的" icon="account" @click="changeTab"></u-tabbar-item>
				</u-tabbar>
			</view>
		</template>
	</BasePage>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref, onMounted } from 'vue';
import { queryParams, stringifyParams } from '@/utils'
import BasePage from '@/components/base-page/index.vue';

const form = ref<any>({
	sdkAppId: '',
})

onMounted(() => {

})

const login = () => {
	uni.navigateTo({
		url: '/pages/user/login'
	})
}

const changeTab = (index: number) => {
	if (index === 0) {
		uni.redirectTo({
			url: '/pages/index/index'
		})
	}
}
</script>

<style lang="scss" scoped>
.body {
	text-align: center;
}

.login-btn {
	margin: 200rpx auto;
	width: 50%;
}
</style>
