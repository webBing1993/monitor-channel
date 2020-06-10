// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-theme-chalk';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)

Vue.config.productionTip = false;

import './mixins'

import Axios from 'axios'

const axios = Axios.create();

// 正在进行中的请求列表
let pending = []; //声明一个数组用于存储每个请求的取消函数和axios标识
let cancelToken = Axios.CancelToken;
let removePending = (config) => {
  console.log(config);
  console.log(pending);
  for(let i in pending){
    if(pending[i].url === config.url) { //在当前请求在数组中存在时执行取消函数
      pending[i].f(); //执行取消操作
      pending.splice(i, 1); // 根据具体情况决定是否在这里就把pending去掉
      // console.log(pending[i].url);
    }
  }
};

//请求拦截
Axios.interceptors.request.use(config => {
  removePending(config); //在一个axios发送前执行一下判定操作，在removePending中执行取消操作
  config.cancelToken = new cancelToken(function executor(c){//本次axios请求的配置添加cancelToken
    pending.push({
      url: config.url,
      // url: Axios.defaults.baseURL+config.url,
      f:c
    });
    // console.log(axios.defaults.baseURL+config.url);
    //将本次的url添加到pending中，因此对于某个url第一次发起的请求不会被取消，因为还没有配置取消函数
  });
  return Promise.resolve(config);
}, error => {
  return Promise.reject(error)
});

import store from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
