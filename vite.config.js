import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署於子路徑，資源需以相對路徑引用
  base: './',
  server: {
    port: 5173,
    host: true,
    watch: {
      // X: 為映射磁碟機，FSWatcher 會崩潰，改用輪詢
      usePolling: true,
      interval: 600,
    },
  },
})
