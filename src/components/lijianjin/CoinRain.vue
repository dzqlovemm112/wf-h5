<script setup lang="ts">
import { ref } from 'vue'

interface Coin {
	id: number
	emoji: string
	left: number
	size: number
	duration: number
}

let seed = 0
const coins = ref<Coin[]>([])
const emojis = ['🪙', '💰', '🧧', '🎉']

function start(count = 18): void {
	for (let i = 0; i < count; i++) {
		setTimeout(() => {
			const id = seed++
			const duration = 1.6 + Math.random() * 1.4
			coins.value.push({
				id,
				emoji: emojis[Math.floor(Math.random() * emojis.length)],
				left: Math.random() * 100,
				size: 18 + Math.random() * 18,
				duration
			})
			setTimeout(() => {
				coins.value = coins.value.filter((c) => c.id !== id)
			}, duration * 1000 + 200)
		}, i * 90)
	}
}

defineExpose({ start })
</script>

<template>
	<view class="coin-layer">
		<text
			v-for="c in coins"
			:key="c.id"
			class="coin"
			:style="{
				left: c.left + 'vw',
				fontSize: c.size + 'px',
				animationDuration: c.duration + 's'
			}"
			>{{ c.emoji }}</text
		>
	</view>
</template>

<style scoped>
.coin-layer {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 150;
	overflow: hidden;
}

.coin {
	position: absolute;
	top: -40px;
	animation: drop linear forwards;
}

@keyframes drop {
	to {
		transform: translateY(110vh) rotate(360deg);
		opacity: 0.2;
	}
}
</style>
