/**
 * Vite 插件：监听 node_modules 中的特定模块
 * 解决 Vite Issue #8619 - 无法监听 node_modules 中特定依赖的问题
 * @param {string[]} modules - 需要监听的模块名数组
 */
export const pluginWatchNodeModules = modules => {
  // 将模块名合并为管道分隔的字符串，用于正则表达式的负向前瞻
  const pattern = `/node_modules\\/(?!${modules.join("|")}).*/`

  return {
    name: "watch-node-modules",
    configureServer: server => {
      server.watcher.options = {
        ...server.watcher.options,
        // 忽略除了指定模块外的所有 node_modules 内容
        ignored: [new RegExp(pattern), "**/.git/**"]
      }
    }
  }
}
