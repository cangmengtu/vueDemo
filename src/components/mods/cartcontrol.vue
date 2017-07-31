<template>
  <div class="cartcontrol">
    <transition name="fadeRotate">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCart">
        <span class="icon-remove_circle_outline inner"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add" @click.stop="addCart">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {mapMutations} from 'vuex'
export default {
  props: ['food', 'isScroll'],
  methods: {
    ...mapMutations([
      'vxaddCart',
      'vxdecreaseCart'
    ]),
    addCart (event) {
      // 判断改组件是否在滚动组件内
      if (this.isScroll) {
        // 判断是否是滚动控件的点击 防止网页版的双点击
        // _constructed是滚动插件所添加的一个
        if (!event._constructed) return
      }
      if (typeof this.food.count === 'undefined') {
        // 局部的要传值过来，对传值过来的数据进行操作，全局的可以直接对组件的数据进行操作
        // Vue.set 可以直接往data里或接收的数据中添加
        // this.$set 需要执行函数的时候传值过来 然后往传值的值里添加
        Vue.set(this.food, 'count', 0)
        Vue.set(this.food, 'active', true)
      }
      this.food.count++
      // 默认为true
      if (this.food.active) {
        this.vxaddCart(this.food)
        this.food.active = false
      }
    },
    decreaseCart (event) {
      if (this.isScroll) {
        if (!event._constructed) return
      }
      this.food.count--
      if (this.food.count === 0) {
        this.vxdecreaseCart(this.food)
      }
    }
  }
}
</script>
