import { defineConfig } from 'vite'
import Adonis from '@adonisjs/vite-plugin-adonis'
export default defineConfig(({ command }) => ({
    plugins: [
        Adonis({
            // Write files to this directory
            outputPath: './public/assets',

            // Prefix the following to the output URL
            publicPath: '/assets',

            // entryPoints: ['']
        })
    ]
})
