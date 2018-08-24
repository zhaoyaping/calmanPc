// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import axios from 'axios'
import $ from 'jquery';
import "./assets/icon/iconfont.css"; 
import echarts from 'echarts'


Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: 'ZQVKW0dvz0tgMy6ZytmY5RxZ'
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,$,
  components: { App },
  template: '<App/>'
})
