import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'http://localhost:3001'

  const proxyRoutes = ['/api', '/uploads', '/generated', '/example-images', '/template-images', '/brand-images']
  const proxy = {}
  proxyRoutes.forEach(route => {
    proxy[route] = { target: backendUrl, changeOrigin: true }
  })

  return {
    plugins: [react()],
    server: { port: 5173, proxy }
  }
})
