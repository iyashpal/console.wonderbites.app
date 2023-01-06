import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command }) => ({

  root: './resources/app',

  plugins: [vue()],

}))
