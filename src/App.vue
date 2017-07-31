<template>
  <div id="app">
    <vheader :seller="datas.seller"></vheader>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 把加载过的组件缓存起来-->
    <keep-alive>
      <router-view :datas="datas" ref="abc"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import vheader from './components/mods/header'
import axios from 'axios'
export default {
  data () {
    return {
      datas: {
        // 商户的信息
        seller: {},
        // 商品数据
        goods: [],
        // 评论
        ratings: []
      }
    }
  },
  name: 'app',
  mounted () {
    axios.get('/static/data.json').then(res => {
      this.datas.seller = res.data.seller
      this.datas.goods = res.data.goods
      this.datas.ratings = res.data.ratings
      // dom更新完之后 ====window.onload
      // dom更新完 => new Scroll() => ajax获取到了数据 => dom
      this.$nextTick(() => {
        this.$refs.abc.initScroll && this.$refs.abc.initScroll()
      })
    })
  },
  components: {
    vheader
  }
}
</script>
<style>
  /* style scoped 当写上 当前这个模板和当前模板下的所有的子模板 应用这个样式*/
  /* 注意优先级*/
  .tab .tab-item a.router-link-active{
    color: #F01414;
  }
</style>

