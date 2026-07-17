<script setup lang="ts">
defineProps<{
	modelValue: boolean
	agreementName: string
	// 主题色
	color?: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', v: boolean): void
	(e: 'open'): void
}>()
</script>

<template>
	<view class="consent">
		<view
			class="box"
			:class="{ checked: modelValue }"
			:style="modelValue ? { background: color, borderColor: color } : {}"
			@click="emit('update:modelValue', !modelValue)"
		>
			<text v-if="modelValue" class="tick">✓</text>
		</view>
		<view class="text">
			我已阅读并同意
			<text class="link" :style="{ color }" @click.stop="emit('open')">{{ agreementName }}</text>
		</view>
	</view>
</template>

<style scoped>
.consent {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: #666;
}

.box {
	flex: 0 0 auto;
	width: 16px;
	height: 16px;
	border: 1px solid #c8c9cc;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 6px;
	transition: all 0.15s ease;
}

.tick {
	color: #fff;
	font-size: 11px;
	line-height: 1;
}

.link {
	color: #1677ff;
}
</style>
