import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"
import { pluginWatchNodeModules } from "monorepo-utils"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), pluginWatchNodeModules(["monorepo-utils", "monorepo-ui"])],
  optimizeDeps: {
    // 排除workspace依赖的预构建，确保使用最新版本
    exclude: ["monorepo-utils", "monorepo-ui"]
  }
})
