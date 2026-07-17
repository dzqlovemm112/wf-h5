<script setup lang="ts">
import { computed } from 'vue'
import { CHANNEL_META } from '@/utils/lijianjin'
import type { Agreement, Channel } from '@/types/lijianjin'

const props = defineProps<{
	show: boolean
	channel: Channel
	agreement: Agreement
}>()

const emit = defineEmits<{
	(e: 'close'): void
}>()

const meta = computed(() => CHANNEL_META[props.channel])

// 优先展示接口返回的协议正文;未返回时用渠道默认文案兜底
const paragraphs = computed<string[]>(() => {
	if (props.agreement.content) {
		return props.agreement.content.split('\n').filter((l) => l.trim())
	}
	const m = meta.value
	return [
		`为向你发放${m.label},我们需要在你明确同意后,通过${m.appName}获取必要授权信息(如用户标识 openid),用于将立减金发放到你的${m.wallet}。`,
		'一、领取规则',
		'1. 每个账号限领对应数量,先到先得,领完即止。',
		'2. 立减金不可提现、不可转赠,仅限本人使用。',
		'3. 支付时满足使用门槛将自动抵扣,订单退款后立减金按规则处理。',
		'二、授权与隐私',
		'4. 你同意授权后,我们仅在本次发放场景使用你的账户标识,不会用于其他用途。',
		`5. 你可在${m.appName}卡包中查看已领取的立减金及有效期。`,
		'三、其他',
		'6. 本活动最终解释权归活动主办方所有。'
	]
})
</script>

<template>
	<view v-if="show" class="mask" @click="emit('close')">
		<view class="sheet" @click.stop>
			<view class="sheet-head">
				<text class="sheet-title">{{ agreement.name }}</text>
				<text class="close" @click="emit('close')">×</text>
			</view>
			<scroll-view scroll-y class="sheet-body">
				<view v-for="(line, i) in paragraphs" :key="i" class="para">{{ line }}</view>
			</scroll-view>
			<view class="confirm" @click="emit('close')">我知道了</view>
		</view>
	</view>
</template>

<style scoped>
.mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 210;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: flex-end;
}

.sheet {
	width: 100%;
	max-height: 76vh;
	background: #fff;
	border-radius: 16px 16px 0 0;
	display: flex;
	flex-direction: column;
	padding: 18px 18px calc(18px + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

.sheet-head {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	padding-bottom: 12px;
}

.sheet-title {
	font-size: 16px;
	font-weight: 600;
}

.close {
	position: absolute;
	right: 0;
	top: -4px;
	font-size: 24px;
	color: #999;
	line-height: 1;
}

.sheet-body {
	max-height: 56vh;
	font-size: 13px;
	line-height: 1.9;
	color: #666;
	padding: 4px 2px 16px;
}

.para {
	margin-bottom: 4px;
}

.confirm {
	height: 46px;
	line-height: 46px;
	text-align: center;
	border-radius: 23px;
	background: #1677ff;
	color: #fff;
	font-size: 16px;
	font-weight: 600;
}
</style>
