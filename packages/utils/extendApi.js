/**
 * @description 封装消息提示组件
 * @param {*} title 提示的内容
 * @param {*} icon 图标
 * @param {*} duration 提示的延迟时间
 * @param {*} mask 是否显示透明蒙层，防止触摸穿透
 */
// 如果用户传入对象作为参数，在形参位置通过解构赋值的方式获取用户传入的参数，同时设置默认值
export const toast = ({ title = "数据加载中", icon = "none", mask = true, duration = 5000 } = {}) => {
  uni.showToast({
    title,
    icon,
    mask,
    duration
  })
}
/**
 * @description 封装 uni.showModal  方法
 * @param {*} options 同 uni.showModal 配置项
 */
export const modal = (options = {}) => {
  // 使用 Promise 处理 uni.showModal 的返回结果
  return new Promise(resolve => {
    // 默认的参数
    const defaultOpt = {
      title: "提示",
      content: "您确定执行该操作吗?",
      confirmColor: "#f3514f"
    }

    // 将传入的参数和默认的参数进行合并
    const opts = Object.assign({}, defaultOpt, options)

    uni.showModal({
      // 将合并的参数赋值传递给 showModal 方法
      ...opts,
      complete({ confirm, cancel }) {
        // 如果用户点击了确定，通过 resolve 抛出 true
        // 如果用户点击了取消，通过 resolve 抛出 false
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}
