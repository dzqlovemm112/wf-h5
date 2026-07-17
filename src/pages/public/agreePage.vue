<template>
    <BasePage class="page">
        <template #header>
            <u-navbar :title="title" :placeholder="true" border="bottom" @leftClick="goBack" />
        </template>
        <view class="body" v-html="content"></view>
    </BasePage>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import BasePage from '@/components/base-page/index.vue';
import { goBack } from '@/utils'
const title = ref<string>('服务协议')
const content = ref<string>('')

onLoad((options) => {
    const { id } = options || {}
    getContent(id)
})

const getContent = async (id: string | number) => {
    content.value = `<div><b>协议内容协议内容协议内容协议内容协议内容协议内容协议内容协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b><b>协议内容<br /><br />123</b></div>`
}

</script>

<style lang="scss" scoped>
.body {
    padding: 20rpx;
}
</style>
