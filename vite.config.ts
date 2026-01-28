import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from 'tailwindcss'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ include: '**/*.svg?react' })],
  server: {
    port: 3000
  },
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@constants/*': path.resolve(__dirname, './src/constants/*'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@pages/*': path.resolve(__dirname, './src/pages/*'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@utils/*': path.resolve(__dirname, './src/utils/*'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hooks/*': path.resolve(__dirname, './src/hooks/*'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@slices': path.resolve(__dirname, './src/redux/slices'),
      '@slices/*': path.resolve(__dirname, './src/redux/slices/*'),
      '@app-types': path.resolve(__dirname, './src/types'),
      '@app-types/*': path.resolve(__dirname, './src/types/*'),
      '@redux/*': path.resolve(__dirname, './src/redux/*'),
      '@redux': path.resolve(__dirname, './src/redux')
    }
  }
})
