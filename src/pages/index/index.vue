<template>
  <BasePage class="page">
    <!-- 头部  -->
    <template #header>
      <u-navbar title="首页" :placeholder="true" border="bottom" leftIcon="" />
    </template>

    <!-- 内容 -->
    <view class="body">内容区</view>

    <!-- 底部 -->
    <template #footer>
      <view class="footer">
        <u-tabbar :value="0">
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

const changeTab = (index: number) => {
  if (index === 1) {
    uni.redirectTo({
      url: '/pages/me/index'
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
}
</style>
