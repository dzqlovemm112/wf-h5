<template>
	<BasePage class="page" pageStyle="background-color:#ffffff;">
		<template #header>
			<u-navbar :placeholder="true" bgColor="transparent" :border="false" @leftClick="goBack" />
		</template>

		<view class="body">
			<!-- 品牌 -->
			<view class="brand">
				<view class="brand-logo">
					<u-icon name="bag" color="#ffffff" :size="40" />
				</view>
				<text class="brand-name">驰丽积分商城</text>
				<text class="brand-slogan">登录后畅享积分兑换好礼</text>
			</view>

			<!-- 步骤一：微信登录 -->
			<view v-if="step === 'login'" class="step">
				<view class="wx-btn" @click="onWechatLogin">
					<u-icon name="weixin-fill" color="#ffffff" :size="24" />
					<text class="wx-text">微信一键登录</text>
				</view>
				<text class="tip">仅用于身份识别，我们不会获取你的隐私信息</text>
			</view>

			<!-- 步骤二：绑定手机号 -->
			<view v-else class="step">
				<view class="bind-title">绑定手机号</view>

				<!-- #ifdef MP-WEIXIN -->
				<button class="wx-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
					<u-icon name="phone-fill" color="#ffffff" :size="22" />
					<text class="wx-text">微信授权手机号</text>
				</button>
				<!-- #endif -->

				<!-- #ifndef MP-WEIXIN -->
				<view class="form">
					<view class="form-row">
						<input
							class="form-input"
							v-model="phone"
							type="number"
							maxlength="11"
							placeholder="请输入手机号"
						/>
					</view>
					<view class="form-row">
						<input
							class="form-input"
							v-model="smsCode"
							type="number"
							maxlength="6"
							placeholder="请输入验证码"
						/>
						<view class="code-btn" :class="{ disabled: counting }" @click="onSendCode">
							{{ counting ? countdown + 's' : '获取验证码' }}
						</view>
					</view>
					<view class="bind-btn" @click="onBindPhoneH5">绑定并登录</view>
				</view>
				<!-- #endif -->
			</view>

			<!-- 协议 -->
			<view class="agreement" @click="checked = !checked">
				<view class="checkbox" :class="{ checked }">
					<u-icon v-if="checked" name="checkmark" color="#ffffff" :size="12" />
				</view>
				<text class="agreement-text">
					我已阅读并同意
					<text class="link" @click.stop="openAgree('user')">《用户协议》</text>
					<text class="link" @click.stop="openAgree('privacy')">《隐私政策》</text>
				</text>
			</view>
		</view>
	</BasePage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BasePage from '@/components/base-page/index.vue'
import { goBack, showToast } from '@/utils'
import { authTool } from '@/components/dzq-auth/authTool'
import { wechatLogin, bindPhone, sendSmsCode } from '@/api/mall'

type Step = 'login' | 'bind'
const step = ref<Step>('login')
const checked = ref<boolean>(false)
const wxToken = ref<string>('')

const phone = ref<string>('')
const smsCode = ref<string>('')
const counting = ref<boolean>(false)
const countdown = ref<number>(60)

onLoad(() => {})

const ensureAgree = (): boolean => {
	if (!checked.value) {
		showToast('请先阅读并同意用户协议与隐私政策')
		return false
	}
	return true
}

/** 步骤一：微信登录 */
const onWechatLogin = async () => {
	if (!ensureAgree()) return
	let code = 'h5-oauth-code'
	// #ifdef MP-WEIXIN
	code = await new Promise<string>((resolve) => {
		uni.login({
			provider: 'weixin',
			success: (res) => resolve(res.code),
			fail: () => resolve('')
		})
	})
	if (!code) {
		showToast('微信登录失败，请重试')
		return
	}
	// #endif

	uni.showLoading({ title: '登录中...' })
	try {
		const res = await wechatLogin(code)
		uni.hideLoading()
		if (res.code === 200) {
			wxToken.value = res.data.token
			if (res.data.needBindPhone) {
				step.value = 'bind'
			} else {
				finishLogin()
			}
		} else {
			showToast(res.message || '登录失败')
		}
	} catch (e) {
		uni.hideLoading()
		showToast('登录异常')
	}
}

/** 步骤二（小程序）：getPhoneNumber 回调 */
const onGetPhoneNumber = async (e: any) => {
	const detail = e?.detail || {}
	if (detail.errMsg && detail.errMsg.indexOf('ok') === -1) {
		showToast('已取消授权')
		return
	}
	uni.showLoading({ title: '绑定中...' })
	try {
		const res = await bindPhone({ encryptedData: detail.encryptedData, iv: detail.iv })
		uni.hideLoading()
		if (res.code === 200) {
			finishLogin()
		} else {
			showToast(res.message || '绑定失败')
		}
	} catch (err) {
		uni.hideLoading()
		showToast('绑定异常')
	}
}

/** 步骤二（H5）：发送验证码 */
const onSendCode = async () => {
	if (counting.value) return
	const res = await sendSmsCode(phone.value)
	if (res.code !== 200 || !res.data.sent) {
		showToast(res.message || '验证码发送失败')
		return
	}
	showToast('验证码已发送')
	counting.value = true
	countdown.value = 60
	const timer = setInterval(() => {
		countdown.value -= 1
		if (countdown.value <= 0) {
			clearInterval(timer)
			counting.value = false
		}
	}, 1000)
}

/** 步骤二（H5）：绑定手机号 */
const onBindPhoneH5 = async () => {
	if (!/^1\d{10}$/.test(phone.value)) {
		showToast('请输入正确的手机号')
		return
	}
	if (!/^\d{4,6}$/.test(smsCode.value)) {
		showToast('请输入验证码')
		return
	}
	uni.showLoading({ title: '绑定中...' })
	try {
		const res = await bindPhone({ phone: phone.value, code: smsCode.value })
		uni.hideLoading()
		if (res.code === 200) {
			finishLogin()
		} else {
			showToast(res.message || '绑定失败')
		}
	} catch (e) {
		uni.hideLoading()
		showToast('绑定异常')
	}
}

const finishLogin = () => {
	authTool.setUserInfo({ access_token: wxToken.value || 'mock-token' })
	showToast('登录成功')
	setTimeout(() => {
		uni.switchTab({ url: '/pages/me/index' })
	}, 800)
}

const openAgree = (type: 'user' | 'privacy') => {
	uni.navigateTo({ url: `/pages/public/agreePage?type=${type}` })
}
</script>

<style lang="scss" scoped>
.page {
	background-color: #ffffff;
}
.body {
	padding: 0 48rpx;
}
.brand {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 0 100rpx;
}
.brand-logo {
	width: 140rpx;
	height: 140rpx;
	border-radius: 40rpx;
	background: linear-gradient(135deg, #7b5cff 0%, #6a5ae0 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 16rpx 36rpx rgba(106, 90, 224, 0.35);
}
.brand-name {
	margin-top: 32rpx;
	font-size: 42rpx;
	font-weight: 700;
	color: #1a1a1a;
}
.brand-slogan {
	margin-top: 16rpx;
	font-size: 26rpx;
	color: #9aa0ab;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.bind-title {
	align-self: flex-start;
	font-size: 32rpx;
	font-weight: 700;
	color: #1a1a1a;
	margin-bottom: 32rpx;
}
.wx-btn {
	width: 100%;
	height: 92rpx;
	border-radius: 46rpx;
	background: linear-gradient(135deg, #2ecc71 0%, #07c160 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14rpx;
	border: none;
}
.wx-btn::after {
	border: none;
}
.wx-text {
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
}
.tip {
	margin-top: 24rpx;
	font-size: 22rpx;
	color: #b8bcc4;
}

.form {
	width: 100%;
}
.form-row {
	display: flex;
	align-items: center;
	height: 96rpx;
	border-bottom: 1rpx solid #eef0f3;
	margin-bottom: 12rpx;
}
.form-input {
	flex: 1;
	font-size: 30rpx;
	color: #1a1a1a;
}
.code-btn {
	font-size: 26rpx;
	color: #6a5ae0;
	font-weight: 600;
	padding-left: 24rpx;
}
.code-btn.disabled {
	color: #b8bcc4;
}
.bind-btn {
	margin-top: 48rpx;
	height: 92rpx;
	border-radius: 46rpx;
	background: linear-gradient(135deg, #7b5cff 0%, #6a5ae0 100%);
	color: #ffffff;
	font-size: 32rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
}

.agreement {
	margin-top: 60rpx;
	display: flex;
	align-items: flex-start;
	gap: 14rpx;
}
.checkbox {
	width: 34rpx;
	height: 34rpx;
	border-radius: 50%;
	border: 2rpx solid #c8ccd4;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 2rpx;
}
.checkbox.checked {
	background: #6a5ae0;
	border-color: #6a5ae0;
}
.agreement-text {
	font-size: 24rpx;
	color: #9aa0ab;
	line-height: 38rpx;
}
.link {
	color: #6a5ae0;
}
</style>
