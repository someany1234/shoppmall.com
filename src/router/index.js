import Vue from 'vue';
import Router from 'vue-router';
import GoodsList from '@/views/GoodsList';
import Cart from '@/views/Cart';
import address from '@/views/address';
import orderConfirm from '@/views/orderConfirm';
import ordersuccess from '@/views/ordersuccess'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'GoodsList',
    component: GoodsList
  }, {
    path: '/cart',
    name: 'Cart',
    component: Cart
  }, {
    path: '/address',
    name: 'address',
    component: address
  }, {
    path: '/orderconfirm',
    name: 'orderconfirm',
    component: orderConfirm
  }, {
    path: '/ordersuccess',
    name: 'ordersuccess',
    component: ordersuccess
  }]
})
