import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 配置 @ 指向 src 目录
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://open.steamdt.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/open')
      },
      '/moreinfo': {
        target: 'https://api.steamdt.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moreinfo/, 'user/skin/v1')
      }
    }
  }
})
