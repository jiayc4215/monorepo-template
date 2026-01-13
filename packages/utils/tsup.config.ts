// packages/utils/tsup.config.ts
export default {
  entry: ["src/index.js"], // 入口文件
  format: ["esm", "cjs"], // 输出格式：esm(ES模块)、cjs(CommonJS)
  clean: true // 清理输出目录
}
