<template>
  <!-- 验证码倒计时按钮 -->
  <button
    class="sms-btn"
    :disabled="isDisabled"
    :hover-class="hover ? 'button-hover' : 'none'"
    @click="handleClick"
    :style="[buttonStyle]"
  >
    {{ buttonText }}
  </button>
</template>

<script>
/**
 * 验证码倒计时按钮组件
 * @description 用于发送短信验证码的倒计时按钮，支持自定义样式和倒计时时间
 * @property {String} text - 按钮默认文本
 * @property {String} sendText - 发送中的按钮文本
 * @property {String} countdownText - 倒计时文本后缀
 * @property {Number} seconds - 倒计时秒数
 * @property {String} width - 按钮宽度
 * @property {String} height - 按钮高度
 * @property {String} padding - 按钮内边距
 * @property {String} margin - 按钮外边距
 * @property {String} radius - 按钮圆角
 * @property {Number} size - 字体大小
 * @property {String} color - 字体颜色
 * @property {String} background - 背景颜色
 * @property {String} borderWidth - 边框宽度
 * @property {String} borderColor - 边框颜色
 * @property {Boolean} isOpacity - 倒计时状态是否透明
 * @property {Boolean} hover - 是否有点击效果
 * @property {Number/String} successVal - 触发倒计时的值，值变化时开始倒计时
 * @property {Number/String} resetVal - 重置倒计时的值，值变化时重置倒计时
 * @property {Boolean} start - 是否自动开始倒计时
 * @property {Number/String} params - 传递给事件的参数
 * @event {Function} send - 点击发送按钮时触发
 * @event {Function} countdown - 倒计时变化时触发
 * @event {Function} end - 倒计时结束时触发
 */
export default {
  name: "SmsCountdownButton",
  /**
   * Vue3 现在提供了一个emits选项，类似于现有props选项。此选项可用于定义组件可以向其父对象发出的事件
   强烈建议使用emits记录每个组件发出的所有事件。
   这一点特别重要，因为去除了.native修饰符。emits 现在在未使用声明的事件的所有侦听器都将包含在组件的中$attrs，默认情况下，该侦听器将绑定到组件的根节点。
   */
  emits: ["countdown", "send", "end"], // 显式声明自定义事件
  props: {
    text: { type: String, default: "发送验证码" }, // 按钮默认文本
    sendText: { type: String, default: "请稍候..." }, // 发送中的按钮文本
    countdownText: { type: String, default: "s后获取" }, // 倒计时文本后缀
    seconds: { type: Number, default: 60 }, // 倒计时秒数
    width: { type: String, default: "182rpx" }, // 按钮宽度
    height: { type: String, default: "56rpx" }, // 按钮高度
    padding: { type: String, default: "0" }, // 按钮内边距
    margin: { type: String, default: "0" }, // 按钮外边距
    radius: { type: String, default: "6rpx" }, // 按钮圆角
    size: { type: Number, default: 24 }, // 字体大小
    color: { type: String, default: "#5677fc" }, // 字体颜色
    background: { type: String, default: "transparent" }, // 背景颜色
    borderWidth: { type: String, default: "1px" }, // 边框宽度
    borderColor: { type: String, default: "#5677fc" }, // 边框颜色
    isOpacity: { type: Boolean, default: true }, // 倒计时状态是否透明
    hover: { type: Boolean, default: true }, // 是否有点击效果
    successVal: { type: [Number, String], default: 0 }, // 触发倒计时的值
    resetVal: { type: [Number, String], default: 0 }, // 重置倒计时的值
    start: { type: Boolean, default: false }, // 是否自动开始倒计时
    params: { type: [Number, String], default: 0 }, // 传递给事件的参数
    disabledColor: { type: String, default: "" } // 禁用状态的字体颜色
  },
  data() {
    return {
      state: "idle", // 按钮状态：idle(空闲)、pending(发送中)、countdown(倒计时)
      remaining: this.seconds, // 剩余秒数
      timer: null // 定时器
    }
  },
  computed: {
    /**
     * 按钮是否禁用
     * @return {Boolean} 非空闲状态时禁用按钮
     */
    isDisabled() {
      return this.state !== "idle"
    },
    /**
     * 按钮文本
     * @return {String} 根据状态返回不同的按钮文本
     */
    buttonText() {
      // 空闲状态
      if (this.state === "idle") {
        return this.text
        // 发送状态
      } else if (this.state === "pending") {
        return this.sendText
        // 倒计时状态
      } else if (this.state === "countdown") {
        return `${this.remaining}${this.countdownText}`
      }
      return ""
    },
    /**
     * 按钮样式
     * @return {Object} 样式对象
     */
    buttonStyle() {
      const style = {
        width: this.width,
        height: this.height,
        padding: this.padding,
        margin: this.margin,
        color: this.color,
        background: this.background,
        borderWidth: this.borderWidth,
        borderColor: this.borderColor,
        borderRadius: this.radius,
        fontSize: this.size + "rpx",
        borderStyle: "solid",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
      // 倒计时状态且需要透明时设置透明度
      if (this.state === "countdown" && this.isOpacity) {
        style.opacity = 0.5
      }

      // 倒计时状态且需要禁用时设置背景颜色
      if (this.disabledColor && this.state === "countdown") {
        style.background = this.disabledColor
      }
      return style
    }
  },
  watch: {
    /**
     * 监听成功值变化，触发倒计时
     */
    successVal(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.success()
      }
    },
    /**
     * 监听重置值变化，重置倒计时
     */
    resetVal(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.reset()
      }
    }
  },
  mounted() {
    // 如果设置了自动开始，则立即开始倒计时
    if (this.start) {
      this.success()
    }
  },
  // 在 Vue3 中组件卸载的生命周期被重新命名  destroyed 修改为 unmounted
  // #ifdef VUE2
  beforeUnmount() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  // #endif
  // #ifdef VUE3
  unmounted() {
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  // #endif
  methods: {
    /**
     * 开始倒计时
     */
    startCountdown() {
      // 清除可能存在的定时器
      if (this.timer) {
        clearInterval(this.timer)
      }
      // 设置状态为倒计时
      this.state = "countdown"
      this.remaining = this.seconds
      // 触发倒计时事件 {因为倒计时事件是每秒触发一次，最开始要触发一次}
      this.$emit("countdown", { seconds: this.remaining, params: this.params })
      // 设置定时器
      this.timer = setInterval(() => {
        // 倒计时
        this.remaining--
        if (this.remaining > 0) {
          // 每秒触发倒计时事件
          this.$emit("countdown", {
            seconds: this.remaining,
            params: this.params
          })
        } else {
          // 倒计时结束，清除定时器
          clearInterval(this.timer)
          this.timer = null
          // 设置状态为空闲
          this.state = "idle"
          // 触发结束事件
          this.$emit("end", { params: this.params })
        }
      }, 1000)
    },
    /**
     * 成功发送验证码，开始倒计时
     */
    success() {
      // 如果按钮状态不为倒计时，则开始倒计时 [空闲状态｜发送中状态都可以进入]
      // 自动开始时是空闲，手动点击时是发送中
      if (this.state !== "countdown") {
        this.startCountdown()
      }
    },
    /**
     * 重置按钮状态
     */
    reset() {
      // 清除定时器
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      // 重置状态
      this.state = "idle"
      // 重置剩余秒数
      this.remaining = this.seconds
    },
    /**
     * 按钮点击处理
     */
    handleClick() {
      // 如果按钮状态为空闲，则设置状态为发送中，并触发发送事件
      if (this.state === "idle") {
        // 设置状态为发送中
        this.state = "pending"
        // 触发发送事件
        this.$emit("send", { params: this.params })
      }
    }
  }
}
</script>

<style scoped>
/* 按钮基本样式 */
.sms-btn {
  display: inline-block; /* 内联块级元素 */
  text-align: center; /* 文本居中 */
  cursor: pointer; /* 鼠标样式 */
}
/* 禁用状态样式 */
.sms-btn:disabled {
  cursor: not-allowed; /* 禁用状态的鼠标样式 */
}
.button-hover {
  transform: scale(0.98); /* 按钮悬停时的缩放 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 按钮悬停时的阴影 */
}
</style>
