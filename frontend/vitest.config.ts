import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json'],
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/main.ts',
          'src/router/**',
          'src/**/*.d.ts',
          'src/**/__tests__/**'
        ],
        thresholds: {
          branches: 70,
          lines: 70,
          functions: 70,
          statements: 70
        }
      }
    }
  })
)
