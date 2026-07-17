<template>
  <BasePage class="page">
    <!-- 头部  -->
    <template #header>
      <u-navbar title="首页" :placeholder="true" border="bottom" leftIcon="" />
    </template>

    <!-- 内容 -->
    <view class="body">
      <view class="ljj-title">立减金领取</view>
      <view class="ljj-sub">微信 / 支付宝 / 银行多卡券</view>
      <view class="ljj-list">
        <view
          v-for="item in ljjEntries"
          :key="item.path"
          class="ljj-card"
          @click="goLjj(item.path)"
        >
          <view class="ljj-dot" :style="{ background: item.color }" />
          <view class="ljj-main">
            <view class="ljj-name">{{ item.title }}</view>
            <view class="ljj-desc">{{ item.desc }}</view>
          </view>
          <text class="ljj-arrow">›</text>
        </view>
      </view>
    </view>

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

const ljjEntries = [
  {
    path: '/pages/lijianjin/wechat',
    title: '微信立减金',
    desc: '含用户同意授权流程',
    color: '#07c160'
  },
  {
    path: '/pages/lijianjin/alipay',
    title: '支付宝立减金',
    desc: '蓝色票券 · 一键领取',
    color: '#1677ff'
  },
  {
    path: '/pages/lijianjin/bank',
    title: '银行立减金(多卡券)',
    desc: '我已阅读同意 + 立刻领取',
    color: '#f4491f'
  }
]

onMounted(() => {

})

const goLjj = (path: string) => {
  uni.navigateTo({ url: path })
}

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

.body {
  padding: 20px 16px 40px;
  background: #f2f3f5;
}

.ljj-title {
  font-size: 22px;
  font-weight: 800;
  text-align: center;
}

.ljj-sub {
  margin-top: 6px;
  margin-bottom: 18px;
  font-size: 13px;
  color: #999;
  text-align: center;
}

.ljj-list {
  display: flex;
  flex-direction: column;
}

.ljj-card {
  display: flex;
  align-items: center;
  padding: 18px 16px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
}

.ljj-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: 0 0 auto;
  margin-right: 12px;
}

.ljj-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ljj-name {
  font-size: 16px;
  font-weight: 600;
}

.ljj-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.ljj-arrow {
  color: #ccc;
  font-size: 22px;
}
</style>
