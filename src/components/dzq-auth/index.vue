<!-- 	目前可以用在按钮登录权限使用，其他的待完善 
方法：
	<Auth @click="dosometing">
        <view> 这里是自定义按钮，注意不要添加点击事件</view>
	</Auth>
-->
<template>
	<view>
		<view @click.stop="checkIsLogin">
			<slot></slot>
		</view>
	</view>
</template>

<script lang="ts" setup>
import {
	authTool,
	isLogin
} from './authTool'
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['onclick'])

const checkIsLogin = () => {
	if (isLogin()) {
		console.log('已经登录 ')
		emit('onclick')

	} else {
		console.log('未登录 ')
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
}
</script>

<style lang="scss"></style>