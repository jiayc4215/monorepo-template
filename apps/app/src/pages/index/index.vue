<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" @click="show"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <uni-badge text="1"></uni-badge>
    <uni-badge text="2" type="success" @click="bindClick"></uni-badge>
    <uni-badge text="3" type="primary" :inverted="true"></uni-badge>
    <repo-countdown></repo-countdown>
  </view>
</template>

<script>
import { modal } from "monorepo-utils/extendApi"

export default {
  data() {
    return {
      title: "Hello"
    }
  },
  onLoad() {},
  methods: {
    show() {
      modal({
        content: "Hello",
        showCancel: false
      })
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
