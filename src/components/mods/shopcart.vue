<template>
  <div class="shopCart left0">
    <div class="content" @click="showFn">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo active">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="badge" v-show="totalPrice > 0">{{count}}</div>
        </div>
        <div class="price" :class="{'active': totalPrice}">￥{{totalPrice}}</div>
        <div class="desc" v-show="totalPrice<99">另需要配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right"  :class="{'enough': totalPrice >= minPrice}">
        <div class="pay">{{payDesc}}</div>
      </div>
    </div>
    <transition name="transHeight">
      <div class="shopcart-list" v-show="totalPrice > 0 && show">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="item in foods">
              <span class="name">{{item.name}}</span>
              <div class="price">
                <span>￥{{item.price}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="item" :isScroll="true"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  // 必须要等dom更新完之后再new才可以
  import Scroll from 'better-scroll'
  import cartcontrol from './cartcontrol'
  export default {
    // 配送费   起步价   数量大于0的商品
    props: ['deliveryPrice', 'minPrice', 'foods'],
    data () {
      return {
        // 选择的商品总数
        'count': 0,
        show: false
      }
    },
    computed: {
      // 总金额
      totalPrice () {
        let total = 0
        this.count = 0
        this.foods.forEach(food => {
          total += food.price * food.count
          this.count += food.count
        })
        return total
      },
      // 还差多少起送
      payDesc () {
        if (this.totalPrice === 0) {
          this.show = false
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          return `还差￥${this.minPrice - this.totalPrice}元起送`
        } else {
          return `去结算`
        }
      }
    },
    methods: {
      empty () {
        this.foods.forEach(val => {
          val.count = 0
          val.active = true
        })
        this.show = false
      },
      showFn () {
        if (this.totalPrice > 0) {
          this.show = !this.show
          // 等待dom更新完之后
          // 第一次展开购物车的时候 10个商品(1000px) 清空 再次添加 5个商品(500px)
          // 延用第一次记录下来的高度
          this.$nextTick(() => {
            this.initScroll()
          })
        }
      },
      initScroll () {
        if (!this.cartScroll) {
          this.cartScroll = new Scroll(this.$refs['listContent'], {
            click: true
          })
        } else {
          // 强制重新计算高度
          this.cartScroll.refresh()
        }
      }
    },
    components: {
      cartcontrol
    }
  }
</script>
