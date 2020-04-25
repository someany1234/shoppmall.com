<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)"
             class="default cur">Default</a>
          <a href="javascript:void(0)"
             class="price short-up"
             @click="goodSort()">Price <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg></a>
          <a href="javascript:void(0)"
             class="filterby stopPop"
             @click="showfilter()">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop"
               id="filter"
               :class="{'filterby-show':filterby==true}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)"
                   @click="priceCheck({},'all')"
                   :class="{'cur':priceChecked=='all'}">All</a></dd>
              <dd v-for="(priceitme,index) in priceFilter"
                  :key="priceitme.startprice">
                <a href="javascript:void(0)"
                   @click="priceCheck(priceitme,index)"
                   :class="{'cur':priceChecked==index}">{{ priceitme.startprice }} - {{ priceitme.endprice }}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="goods in goodsList"
                    :key="goods.prodcutId">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/'+ goods.productImage"
                           alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ goods.productName }}</div>
                    <div class="price">￥{{ goods.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;"
                         class="btn btn--m"
                         @click="addCart(goods.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="view-more-normal"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy"
         infinite-scroll-distance="30">
      <img src="../assets/loading-spinning-bubbles.svg"
           alt=""
           v-if="loading">
      <div v-else>没有更多了</div>
    </div>
    <div class="md-overlay"
         v-show="overLayFlag"
         @click="closePop()"></div>
    <modal v-show="modalState"
           @modalshow="modalShow">
      <p slot="message">请先登录，否则无法加入到购物车</p>
      <div slot="btnGroup">
        <a class="btn btn--m"
           @click="modalState=false">关闭</a>
      </div>
    </modal>
    <modal v-show="mdShowCart"
           @closeModal="closemodal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink"
               xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m"
           href="javascript:;"
           @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red"
                     href="javascript:;"
                     to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import '@/assets/css/base.css'
import '@/assets/css/product.css'
import '@/assets/css/login.css'
import NavHeader from '@/components/NavHeader.vue'
import NavBread from '@/components/NavBread.vue'
import NavFooter from '@/components/NavFooter.vue'
import axios from 'axios'
import Modal from '@/components/Modal.vue'
export default {
  data () {
    return {
      goodsList: [],
      priceFilter: [{ startprice: 0.00, endprice: 100.00 },
      { startprice: 100.00, endprice: 500.00 },
      { startprice: 500.00, endprice: 1000.00 },
      { startprice: 1000.00, endprice: 2000.00 }],
      priceLevel: {},
      page: 1,
      pageSzie: 8,
      sort: true,
      priceChecked: "all",
      filterby: false,
      overLayFlag: false,
      busy: true,
      loading: false,
      modalState: false,
      mdShowCart: false
    }
  },
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal,
  },
  mounted () {
    this.getgoodslist()
  },
  methods: {
    priceCheck (priceitem, index) {
      this.priceChecked = index;
      this.closePop();
      this.priceLevel = priceitem;
      this.page = 1;
      this.getgoodslist();
    },
    showfilter () {
      this.filterby = true;
      this.overLayFlag = true
    },
    closePop () {
      this.filterby = false;
      this.overLayFlag = false
    },
    getgoodslist (flag) {
      var params = {
        page: this.page,
        pageSize: this.pageSzie,
        sort: this.sort == true ? 1 : -1,
        pricefiter: this.priceLevel,
      }
      axios.get("/goods/list", {
        params: params
      }).then((response) => {
        let res = response.data;
        if (res.status == 0) {
          if (flag) {
            this.goodsList = res.result.goodslist;
            if (res.result.count < this.pageSzie * this.page) {
              this.busy = true;
              this.loading = false;
            } else {
              this.loading = true;
              this.busy = false;
            }
          } else {
            this.goodsList = res.result.goodslist;
            this.busy = false;
          }
        } else {
          this.goodsList = []
        }
      });
    },
    goodSort () {
      this.sort = !this.sort;
      // this.page = 1
      this.getgoodslist()
    },
    loadMore () {
      this.loading = true;
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getgoodslist(true);
      }, 500);
    },
    addCart (productid) {
      axios.post('/goods/addCart', {
        productId: productid
      }).then((response) => {
        let res = response.data
        if (res.status == 10001) {
          this.modalState = true
        } else {
          this.mdShowCart = true
        }
      })
    },
    modalShow () {
      this.modalState = false
    },
    closemodal () {
      this.mdShowCart = false
    }
  }
}
</script>
