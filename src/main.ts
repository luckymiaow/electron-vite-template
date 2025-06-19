import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import { routes } from 'vue-router/auto-routes'
import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app').$nextTick(() => {
    // Use contextBridge
    // window.ipcRenderer.on('main-process-message', (_event, message) => {
    //   console.log(message)
    // })
  })

