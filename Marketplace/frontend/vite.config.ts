
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const { DEV_CATALOG_PROXY, DEV_USERS_PROXY, DEV_ORDERS_PROXY } = loadEnv(mode, process.cwd(), 'DEV_')

  return {
    plugins: [react()],

    server: {
      port: 5173,
      proxy: {
        ...(DEV_CATALOG_PROXY && {
          '/api/catalog': { target: DEV_CATALOG_PROXY, changeOrigin: true },
        }),
        ...(DEV_USERS_PROXY && {
          '/api/users': { target: DEV_USERS_PROXY, changeOrigin: true },
        }),
        ...(DEV_ORDERS_PROXY && {
          '/api/orders': { target: DEV_ORDERS_PROXY, changeOrigin: true },
        }),
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },

    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      clearMocks: true,
    },
  }
})
