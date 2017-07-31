<template>
  <div class="ratingsWrapper" ref="ratingsWrapper">
    <div class="ratings-content">
      <div class="info">
        <div class="mark">
          <div class="num">{{datas.seller.score}}</div>
          <div class="text">综合评分</div>
          <div class="contrast">高于周边商家{{datas.seller.rankRate}}%</div>
        </div>
        <div class="stars">
          <div class="serviceScore">
            <span class="text">服务态度</span>
            <star :size="36" :score="datas.seller.serviceScore"></star>
            <span class="num">{{datas.seller.serviceScore}}</span>
          </div>
          <div class="foodScore">
            <span class="text">商品评分</span>
            <star :size="36" :score="datas.seller.foodScore"></star>
            <span class="num">{{datas.seller.foodScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="text">送达时间</span>
            <span class="time">{{datas.seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="evaluation">
        <div class="classify">
          <span class="item" v-for="(item, index) in classify"
                :class="{'active': item.active, 'bad': index === 2, 'badActive': index === 2 && item.active}"
                @click="classifyClick(item)">
            {{item.name}}
            <span class="count">{{item.count}}</span>
          </span>
        </div>
        <div class="switch" @click="showClick">
          <span class="icon-check_circle" :class="{'on': show}"></span>
          <span class="text">只看有内容评价</span>
        </div>
        <div class="evel-list">
          <ul>
            <li class="evel" v-for="item in commontss">
              <div class="avatar">
                <img :src="item.avatar" alt="" width="28" height="28">
              </div>
              <div class="content">
                <div class="user">
                  <span class="name">{{item.username}}</span>
                  <span class="rateTime">{{item.rateTime | timeFilter}}</span>
                </div>
                <div class="star-wrapper">
                  <star :size="24" :score="item.score"></star>
                  <span class="deliveryTime">{{item.deliveryTime || 0}}分钟送达</span>
                </div>
                <div class="text">{{item.text}}</div>
                <div class="recommend">
                  <span class="icon" :class="item.rateType ? 'icon-thumb_down':'icon-thumb_up' "></span>
                  <span class="dish" v-for="dish in item.recommend">{{dish}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import star from './mods/star'
  import Scroll from 'better-scroll'
  export default {
    props: ['datas'],
    data () {
      return {
        ratings: [],
        classify: [
          {name: '全部', active: true, count: 0, comments: []},
          {name: '推荐', active: false, count: 0, comments: []},
          {name: '吐槽', active: false, count: 0, comments: []}
        ],
        comments: [],
        show: true
      }
    },
    // 缓存是只第一次执行，之后都不执行
    mounted () {
      axios.get('/static/data.json').then(res => {
        this.ratings = this.comments = res.data.ratings
        this.ratings.forEach(val => {
          this.classify[0].count++
          this.classify[0].comments.push(val)
          if (val.rateType) {
            this.classify[2].count++
            this.classify[2].comments.push(val)
          } else {
            this.classify[1].count++
            this.classify[1].comments.push(val)
          }
        })
        // 这里是刚刚把评论归类好 => 注册了一个$nextTick => 计算属性里的执行 => 更新dom =>触发了$nextTick => new滚动插件
        this.initScroll()
      })
    },
    activated () {
      // 有没有被缓存都会执行这里
    },
    methods: {
      classifyClick (item) {
        this.classify.forEach(val => {
          val.active = false
        })
        this.comments = item.comments
        item.active = true
      },
      showClick (event) {
        if (!event._constructed) return
        this.show = !this.show
      },
      initScroll () {
        this.$nextTick(() => {
          if (!this.ratingScroll) {
            this.ratingScroll = new Scroll(this.$refs['ratingsWrapper'], {
              click: true
            })
          } else {
            this.ratingScroll.refresh()
          }
        })
      }
    },
    computed: {
      commontss () {
        this.initScroll()
        let arr = []
        if (this.show) {
          this.comments.forEach(val => {
            if (val.text.length > 0) arr.push(val)
          })
        } else {
          arr = this.comments
        }
        return arr
      }
    },
    components: {
      star
    },
    filters: {
      timeFilter (val) {
        let time = new Date(val)
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
      }
    }
  }
</script>
