import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import {Graph} from "@antv/x6";
declare global {
    interface Window {
        __x6_instances__?: Graph[]
    }
}
const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
