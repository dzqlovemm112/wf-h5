<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import type { Channel, ClaimResultType } from '@/types/lijianjin'
import { CHANNEL_META } from '@/utils/lijianjin'
import CoinRain from '@/components/lijianjin/CoinRain.vue'

const coinRain = ref<InstanceType<typeof CoinRain> | null>(null)

const channel = ref<Channel>('wechat')
const type = ref<ClaimResultType>('fail')
const amount = ref(0)

const meta = computed(() => CHANNEL_META[channel.value])

const view = computed(() => {
	switch (type.value) {
		case 'success':
			return {
				icon: '✓',
				color: '#07c160',
				title: '领取成功',
				desc: `¥${amount.value} ${meta.value.label}已到账,可在${meta.value.wallet}中查看使用。`
			}
		case 'claimed':
			return {
				icon: '!',
				color: '#ff9f0a',
				title: '你已领取过',
				desc: '该立减金已领取,请勿重复领取,可在卡包中查看。'
			}
		case 'expired':
			return {
				icon: '×',
				color: '#c0c0c0',
				title: '活动已结束',
				desc: '很遗憾,本次立减金活动已结束或已被领完。'
			}
		default:
			return {
				icon: '×',
				color: '#fa5151',
				title: '领取失败',
				desc: '网络异常或授权未完成,请返回重试。'
			}
	}
})

onLoad((options) => {
	const q = options || {}
	channel.value = q.channel === 'alipay' ? 'alipay' : 'wechat'
	const t = q.type
	type.value =
		t === 'claimed' || t === 'expired' || t === 'fail' || t === 'success'
			? t
			: 'fail'
	amount.value = Number(q.amount ?? 0)
})

onReady(() => {
	if (type.value === 'success') coinRain.value?.start()
})

function backHome() {
	uni.reLaunch({ url: '/pages/index/index' })
}
</script>

<template>
	<view class="result">
		<view class="icon" :style="{ background: view.color }">{{ view.icon }}</view>
		<view class="r-title">{{ view.title }}</view>
		<view v-if="type === 'success'" class="amount">¥{{ amount }}</view>
		<view class="desc">{{ view.desc }}</view>

		<view class="btn" :style="{ background: meta.primary }" @click="backHome">
			{{ type === 'success' ? '完成' : '返回' }}
		</view>

		<CoinRain ref="coinRain" />
	</view>
</template>

<style scoped>
.result {
	min-height: 100vh;
	background: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 90px 32px 40px;
	box-sizing: border-box;
}

.icon {
	width: 72px;
	height: 72px;
	border-radius: 50%;
	color: #fff;
	font-size: 40px;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: pop 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

@keyframes pop {
	from {
		transform: scale(0.5);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

.r-title {
	margin-top: 20px;
	font-size: 20px;
	font-weight: 600;
}

.amount {
	margin-top: 12px;
	font-size: 34px;
	font-weight: 800;
	color: #fa5151;
}

.desc {
	margin-top: 12px;
	font-size: 13px;
	color: #999;
	line-height: 1.7;
	text-align: center;
}

.btn {
	margin-top: 40px;
	width: 100%;
	max-width: 300px;
	height: 46px;
	line-height: 46px;
	text-align: center;
	border-radius: 23px;
	color: #fff;
	font-size: 16px;
	font-weight: 600;
}
</style>
