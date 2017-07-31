export default {
  // 默认第一个接收的参数是vuex里所定义的数据 第二个是参过来的参数
  vxaddCart (state, val) {
    state.vxfood.push(val)
  },
  vxdecreaseCart (state, val) {
    state.vxfood.forEach((value, index) => {
      if (value.name === val.name) {
        state.vxfood.splice(index, 1)
      }
    })
  }
}
