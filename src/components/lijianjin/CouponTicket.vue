<script setup lang="ts">
import type { Coupon } from '@/types/lijianjin'

defineProps<{
	coupon: Coupon
}>()
</script>

<template>
	<view class="ticket">
		<view class="ticket-left">
			<view class="amount"><text class="sym">¥</text>{{ coupon.amount }}</view>
			<view class="name">{{ coupon.name }}</view>
		</view>
		<view class="ticket-right">
			<text v-if="coupon.count > 1" class="count">X{{ coupon.count }}</text>
		</view>
	</view>
</template>

<style scoped>
.ticket {
	position: relative;
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, #ff7a59 0%, #f4491f 100%);
	border-radius: 10px;
	color: #fff;
	padding: 18px 16px;
	overflow: hidden;
	margin-top: 10px;
}

.ticket-left {
	flex: 1;
	padding-left: 12px;
}

.amount {
	font-size: 30px;
	font-weight: 800;
	line-height: 1;
}

.amount .sym {
	font-size: 16px;
	margin-right: 2px;
}

.name {
	font-size: 13px;
	margin-top: 6px;
	opacity: 0.95;
}

.ticket-right .count {
	display: inline-block;
	background: rgba(0, 0, 0, 0.18);
	border-radius: 12px;
	padding: 2px 10px;
	font-size: 13px;
	font-weight: 600;
}
</style>
