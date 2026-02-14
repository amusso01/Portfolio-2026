/**
 * =============================================================================
 * Vite Configuration
 * =============================================================================
 *
 * PLUGINS:
 * - @vitejs/plugin-react: Fast Refresh, JSX transform
 * - vite-plugin-source-identifier: Adds data-matrix attributes for debugging
 *   (enabled only when BUILD_MODE !== 'prod')
 *
 * ALIASES:
 * - @ -> ./src (e.g. import { cn } from '@/lib/utils')
 */
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
