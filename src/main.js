// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex';

Vue.use(Vuex)
var store = new Vuex.Store({
  state: {
    mdShowCart: false
  },
  getters: {

  },
  mutations: {
    closemodal(state) {
      state.mdShowCart = false;
    },
    showmodal(state) {
      state.mdShowCart = true;
    }
  }
})

Vue.use(infiniteScroll)

Vue.use(VueLazyload)


Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'static/loading-svg/loading-bars.svg',
  attempt: 3
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
