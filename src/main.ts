import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import {Graph} from "@antv/x6";
import 'ant-design-vue/dist/reset.css';
declare global {
    interface Window {
        __x6_instances__?: Graph[]
    }
}
const app = createApp(App)
app.use(Antd)
app.mount('#app')
