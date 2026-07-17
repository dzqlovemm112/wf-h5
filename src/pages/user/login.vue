<template>
	<BasePage class="page">
		<template #header>
			<u-navbar title="登录" :placeholder="true" border="bottom" @leftClick="goBack" />
		</template>
		<view class="body">
			<view class="title">
				欢迎使用
			</view>
			<view class="btn-login">
				<u-button type="primary">
					手机号快捷登录
				</u-button>
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import BasePage from '@/components/base-page/index.vue';
import {
	getDoctorByPhone,
	getwechatTelAndCode,
} from '@/api/api'
import {
	authTool
} from '@/components/dzq-auth/authTool'
import { onLoad } from '@dcloudio/uni-app'
import { goBack } from '@/utils'
import { ref } from 'vue'

const title = ref<string>('欢迎使用xxx')
const checked = ref<boolean>(false)

onLoad(() => {

})

//微信登录授权手机号
const decryptPhoneNumber = (e: any) => {

}
</script>

<style lang="scss" scoped>
.page {}

.title {
	font-size: 36rpx;
	color: #8f8f94;
	text-align: center;
}

.btn-login {
	margin: 100rpx auto;
	width: 300rpx;
}
</style>