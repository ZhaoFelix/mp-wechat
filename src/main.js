import Vue from 'vue'
import App from './App'
import WXRequest from "./utils/wx-request";

Vue.config.productionTip = false
App.mpType = 'app'
import store from "./store/store";
//加载到原型
Vue.prototype.$store = store;
Vue.prototype.$wxRequest = WXRequest;
const app = new Vue({
    ...App,
    store,
  });
app.$mount()
