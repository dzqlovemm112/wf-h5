<!-- 
  基础页面框架
  @author: DH
  @date: 2026-01-23
  @description: 节省重复代码，方便统一管理。（页面有无限加载功能的需要自行固定滚动容器的高度或修改样式）
  -->

<template>
  <view class="base-page" :class="pageClass" :style="pageStyle">
    <!-- 头部插槽 -->
    <slot v-if="hasHeaderSlot" name="header"></slot>

    <!-- 主体内容区域 -->
    <view class="body" :class="bodyClass" :style="bodyStyle">
      <slot></slot>
    </view>

    <!-- 底部插槽 -->
    <slot v-if="hasFooterSlot" name="footer"></slot>
  </view>
</template>

<script lang="ts" setup>
import { useSlots, computed } from 'vue'

interface Props {
  /** 自定义 base-page 类名 */
  pageClass?: string | string[] | Record<string, boolean>
  /** 自定义 base-page 样式 */
  pageStyle?: string | Record<string, any>
  /** 自定义 body 类名 */
  bodyClass?: string | string[] | Record<string, boolean>
  /** 自定义 body 样式 */
  bodyStyle?: string | Record<string, any>
}

withDefaults(defineProps<Props>(), {
  pageClass: '',
  pageStyle: () => ({}),
  bodyClass: '',
  bodyStyle: () => ({})
})

const slots = useSlots()

// 检测插槽是否存在
const hasHeaderSlot = computed(() => !!slots.header)
const hasFooterSlot = computed(() => !!slots.footer)
</script>

<style lang="scss" scoped>
.base-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-sizing: border-box;
  // 底部安全区域
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .body {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
</style>