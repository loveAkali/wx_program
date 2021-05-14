//index.js
var app = getApp()
Page({
  data: {
    scrollHeight:0,
  },
  bindGoodsTap: function(e) {
    console.log(e);
    wx.navigateTo({
      url: `../goods/index?GoodsId=${e.currentTarget.dataset.url}`
    })
  },
  moreTap: function(){
    wx.navigateTo({
      url: '../report/index',
    })
  },
  async onLoad(){
    console.log('onLoad')
    var that = this
    await this.getGoods();
    // app.globalData.goods.forEach((value, key) => {
    //   console.log(`K: ${key}, V:`)
    //   console.log(value)
    // })
  },
  /** 获取一屏（6个）商品信息 */
  getGoods() {
    // 未加入各种筛选功能
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.cloudFunctions.getGoods,
        data: {
          Status: 0,
          Pos: this.data.scrollHeight,
          category: [],
        },
        success: res => {
          if (res.data == -1) {
            console.log('查询参数发生错误')
            return
          }
          res.data.forEach(item => {
            app.globalData.goods.set(item.GoodsId, item)
          })
          app.globalData.goodsPos += res.data.length
          if (res.data.length < 6) {
            console.log('少于6个，停止刷新')
            // TODO: 显示“到底了”
          }
          else{
            let add_values=Array.from(app.globalData.goods.values());
            this.setData({
               values: add_values
            })
          }
          resolve(res.data)
        },
        fail: res => {
          console.log('向服务器请求时发生错误，请检查网络连接，稍后重试')
          console.log(res)
          reject(res)
        }
      })
    })
  },
  lower: function () {
    wx.showNavigationBarLoading();
    var that = this;
    this.data.scrollHeight+=6;
    wx.hideNavigationBarLoading(that.getGoods());
    console.log("lower")
  },
})
