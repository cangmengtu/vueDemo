<template>
  <transition name="move">
    <div class="detailWrapper" ref="detailWrapper" v-show="showDetail">
      <div class="foodDetail">
        <div class="back" @click="showDetail=false">
          <i class="icon-arrow_lift"></i>
        </div>
        <img :src="food.image" alt="" width="100%" height="425">
        <div class="info">
          <div class="title">{{food.name}}</div>
          <div class="desc">
            <span>月售{{food.sellCount}}</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">￥{{food.price}}</div>
          <transition name="fade">
            <div class="shopCart" @click="add" v-show="!food.count || food.count === 0">
              <div class="text">加入购物车</div>
            </div>
          </transition>
          <cartcontrol ref="cartcontrol" :food="food" :isScroll="true"></cartcontrol>
        </div>
        <div class="divider"></div>
        <div class="desc">
          <div class="title">商品介绍</div>
          <div class="content">{{food.info}}</div>
        </div>
        <div class="divider"></div>
        <div class="evaluation">
          <div class="title">商品评价</div>
          <div class="classify">
            <span class="item" v-for="(item, index) in classify" :class="{'active': item.active, 'bad': index === 2, 'badActive': index===2 && item.active}" @click="classifyClick(item)">{{item.name}}
              <span class="count">{{item.count}}</span>
            </span>
          </div>
          <div class="switch">
            <span class="icon-check_circle" @click="flagClick" :class="{'on': flag}"></span>
            <span class="text">只看有内容的评价</span>
          </div>
          <div class="evel-list">
            <ul>
              <li class="evel" v-for="item in commontss">
                <div class="userInfo">
                  <div class="time">{{item.rateTime | timeFilter}}</div>
                  <div class="user">
                    <span>{{item.username}}</span>
                    <img :src="item.avatar" alt="" width="12" height="12">
                  </div>
                </div>
                <div class="content">
                  <span class="icon" :class="item.rateType?'icon-thumb_down':'icon-thumb_up'"></span>
                  <span class="text">{{item.text}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'better-scroll'
  import cartcontrol from './cartcontrol'
  export default {
    data () {
      return {
        showDetail: false,
        food: [],
        classify: [
          {name: '全部', count: 0, commonts: [], active: true},
          {name: '推荐', count: 0, commonts: [], active: false},
          {name: '吐槽', count: 0, commonts: [], active: false}
        ],
        commonts: [],
        flag: true
      }
    },
    mounted () {
      // 1.注册了一个$nextTick 2.更新 3.检测到dom更新完 执行$nextTick里的回调
      // this.$nextTick(() => {})
      this.initScroll()
    },
    methods: {
      add (event) {
        this.$refs['cartcontrol'].addCart(event)
      },
      foodShow () {
        this.showDetail = true
        // 等dom更新完 jq.ready
        this.$nextTick(() => {
          this.commonts = this.food.ratings
          this.classify.forEach(val => {
            val.commonts = []
            val.count = 0
            val.active = false
          })
          this.classify[0].active = true
          this.food.ratings.forEach(val => {
            this.classify[0].count++
            this.classify[0].commonts.push(val)
            if (val.rateType) {
              this.classify[2].count++
              this.classify[2].commonts.push(val)
            } else {
              this.classify[1].count++
              this.classify[1].commonts.push(val)
            }
          })
        })
        this.initScroll()
      },
      initScroll () {
        this.$nextTick(() => {
          if (!this.detailScroll) {
            this.detailScroll = new Scroll(this.$refs['detailWrapper'], {
              click: true
            })
          } else {
            this.detailScroll.refresh()
          }
        })
      },
      classifyClick (item) {
        this.commonts = item.commonts
        this.classify.forEach(val => {
          val.active = false
        })
        item.active = true
      },
      flagClick (event) {
        if (!event._constructed) return
        this.flag = !this.flag
      }
    },
    computed: {
      commontss () {
        this.initScroll()
        let arr = []
        if (this.flag) {
          // 只看有内容评价
          this.commonts.forEach(val => {
            if (val.text.length > 0) {
              arr.push(val)
            }
          })
        } else {
          // 看全部评价
          arr = this.commonts
        }
        return arr
      }
    },
    components: {
      cartcontrol
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
