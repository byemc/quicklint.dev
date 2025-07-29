import legacy from '@vitejs/plugin-legacy'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
    plugins: [
        legacy({
            targets: ["defaults", "> 0.05%", "last 2 versions", "Explorer >= 11", "not dead"],
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                xml: resolve(__dirname, 'xml/index.html'),
                json: resolve(__dirname, 'json/index.html'),
            },
        },
    },

}