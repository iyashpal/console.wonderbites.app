import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command }) => ({

  root: resolve(__dirname, './resources/app'),

  plugins: [vue()],

  server: {

    port: 8080,

  },

  preview: {

    port: 3000,

  },

  resolve: {

    alias: {

      '@': resolve(__dirname, './resources/app'),

      VueApp: resolve(__dirname, './resources/app'),

    },

  },

}))
