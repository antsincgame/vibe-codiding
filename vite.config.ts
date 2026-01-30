import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, readdirSync, mkdirSync, existsSync, statSync, lstatSync } from 'fs'
import { join, resolve } from 'path'

function copyPublicFilesPlugin() {
  return {
    name: 'copy-public-files',
    closeBundle() {
      const publicDir = resolve(__dirname, 'public')
      const distDir = resolve(__dirname, 'dist')

      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true })
      }

      const files = readdirSync(publicDir)
      for (const file of files) {
        if (file.includes('copy')) continue
        const src = join(publicDir, file)
        const dest = join(distDir, file)
        try {
          const stat = lstatSync(src)
          if (stat.isFile()) {
            copyFileSync(src, dest)
          }
        } catch (e) {
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyPublicFilesPlugin()],
  publicDir: false,
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
