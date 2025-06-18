import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { watch } from 'vue';
import fs from 'fs';
import { readServices } from './gen_api';
import AutoImport from 'unplugin-auto-import/vite';
import Unocss from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { debounce } from 'lodash-es';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'electron'),
    }
  },

  plugins: [
    Unocss(),
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        // 'vue-i18n',
        // '@vueuse/head',
        // '@vueuse/core',
        // {
        //   // add any other imports you were relying on
        //   'vue-router/auto': ['useLink'],
        // },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),

    {
      name: 'watch-services',
      configureServer(server) {
        const debouncedRead = debounce(() => {
          readServices();
        }, 300);

        const watchDirs = ['./electron/db', './electron/services'];
        watchDirs.forEach(dir => {
          fs.watch(path.join(__dirname, dir), { recursive: true }, (event, filename) => {
            if (filename && !filename.includes('index.ts')) {
              debouncedRead();
            }
          });
        });
      }
    },
    vue(),
    ViteComponents({
      dts: 'src/components.d.ts',
      resolvers: [
        (componentName: string) => {
          if (componentName.startsWith('CIcon'))
            return { name: componentName.slice(5), from: '@ant-design/icons-vue' };
        },
        AntDesignVueResolver({ importStyle: false }),
      ],
    }),

    electron({

      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),


  ],

})
