import http from '@/common/request'
import store from './store'
import md5 from "@/common/md5.js";
import publicFc from "@/common/publicFc.js";
// import socketTask from "@/common/socketTask.js";
import {ws} from "@/common/socketTask.js";
import zmmFormCheck from './common/zmmFormCheck.js';
import pinyin from './common/pinyin.js';
// #ifndef VUE3
import Vue from 'vue'
import App from './App'




Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$store = store
Vue.prototype.$fc = publicFc;
Vue.prototype.$md5 = md5
Vue.prototype.$zmmFormCheck = zmmFormCheck;
Vue.prototype.$pinyin = pinyin;
Vue.prototype.$ws = ws;
App.mpType = 'app'
// main.ts
import { initVConsole } from '@/uni_modules/vconsole-uni';

// 仅在开发环境启用（示例，视项目构建环境而定）
initVConsole({
  enableDebug: false, // 生产建议设为 false 或使用环境变量控制
  maxLogNumber: 1000, // 保留日志条数（默认 1000）
  maxNetNumber: 1000, // 保留网络记录条数（默认 1000）
});
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$http = http
  app.config.globalProperties.$fc = publicFc
  app.config.globalProperties.$md5 = md5
  app.config.globalProperties.$zmmFormCheck = zmmFormCheck
  app.config.globalProperties.$pinyin = pinyin
  app.config.globalProperties.$ws = ws
  app.use(store);
  return {
    app
  }
}
// #endif