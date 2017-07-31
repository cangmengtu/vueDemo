<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li :id="'menu-'+index" class="menu-item" :class="{'menu-item-selected': index === curIndex}" v-for="(item, index) in datas.goods" @click="goGood('#good-'+index, index)">
          <span class="text">
            <span v-show="item.type > 0" class="iconMap" :class="icon[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="(item, index) in datas.goods" :id="'good-'+index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item" v-for="food in item.foods"   @click="detailPage(food)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="sell-info">
                  <span class="sellCount">月售{{food.sellCount}}</span>
                  <span class="rating">好评率{{food.rating}}</span>
                  <div class="price">
                    <span class="newPrice">
                      <span class="unit">￥</span>
                      {{food.price}}
                    </span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" :isScroll="true"></cartcontrol>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :deliveryPrice="datas.seller.deliveryPrice" :minPrice="datas.seller.minPrice" :foods="foods"></shopcart>
    <foodDetail ref="foodDetail"></foodDetail>
  </div>
</template>
<script>
  import icon from './mods/icon'
  import Scroll from 'better-scroll'
  import shopcart from './mods/shopcart'
  import cartcontrol from './mods/cartcontrol'
  import foodDetail from './mods/foodDetail'
  export default {
    props: ['datas'],
    data () {
      return {
        icon,
        curIndex: 0,
        listHeight: []
      }
    },
    computed: {
      foods () {
        let arr = []
        // forEach 回调里的参数 1.value 2.index
        this.datas.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count > 0) {
              arr.push(food)
            }
          })
        })
        return arr
      }
    },
    mounted () {
      // dom更新完之后 ====window.onload
      // dom更新完 => new Scroll() => ajax获取到了数据 => dom
      this.$nextTick(() => {
        this.initScroll()
        setTimeout(() => {
          let arr = []
          for (let i = 0; i < this.datas.goods.length; i++) {
            arr.push(this.$el.querySelector(`#good-${i}`).offsetTop)
          }
          this.listHeight = arr
        }, 16)
      })
    },
    methods: {
      initScroll () {
        /* 需要绑定要滚动元素的父级元素 */
        /* eslint-disable no-new */
        // new Scroll(this.$refs['foodsWrapper'])
        if (!this.foodScroll) {
          this.foodScroll = new Scroll(this.$refs['foodsWrapper'], {
            click: true,
            scrollX: true,
            probeType: 2
          })
        } else {
          this.foodScroll.refresh()
        }
        this.foodScroll.on('scroll', (pos) => {
          this.currentIndex(Math.abs(pos.y))
          let menu = this.$el.querySelector(`#menu-${this.curIndex}`)
          this.menuScroll.scrollToElement(menu)
        })
        if (!this.menuScroll) {
          this.menuScroll = new Scroll(this.$refs['menuWrapper'], {
            click: true
          })
        } else {
          this.menuScroll.refresh()
        }
      },
      goGood (selector, index) {
        if (!event._constructed) return
        var good = this.$el.querySelector(selector)
        this.foodScroll.scrollToElement(good)
        this.curIndex = index
      },
      detailPage (food) {
        this.$refs['foodDetail'].food = food
        this.$refs['foodDetail'].foodShow()
      },
      currentIndex (scrollY) {
        for (let i = 0; i < this.listHeight.length; i++) {
          // 判断当currentIndex在height1和height2之间的时候显示
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          //          console.log('height1:'+height1+','+'height2:'+height2)
          // 最后一个区间没有height2
          if (!height2 || (scrollY >= height1 && scrollY < height2)) {
            this.curIndex = i
            return
          }
        }
      }
    },
    components: {
      shopcart,
      cartcontrol,
      foodDetail
    }
  }
</script>
