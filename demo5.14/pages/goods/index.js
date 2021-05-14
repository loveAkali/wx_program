// pages/goods/index.js
var util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  reportTap: function(e) {
    console.log(`../report/index?GoodsId=${this.data.goodsInfo.GoodsId}`);
    wx.navigateTo({
      url: `../report/index?GoodsId=${this.data.goodsInfo.GoodsId}`
    })
  },
  cancelBookGoods() {
    wx.request({
      url: app.globalData.cloudFunctions.cancelBook,
      data: {
        GoodsId: this.data.goodsInfo.GoodsId
      },
      success: res => {
        if (res.data == -1) {
          console.log('发生未知错误，请稍后重试')
        }
        else if (res.data == 1) {
          // 也可能是商品本来未预定过
          console.log('商品取消预定成功')
          this.setData({
            'goodsInfo.Bookperson': null,
            bookedMyself: false
          })
        }
        //console.log(res)
      },
      fail: res => {
        console.log('向服务器请求时发生错误，请检查网络连接，稍后重试')
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    getApp().globalData.userInfo.nickName = 'zzyn'
     this.setData({
       goodsInfo: app.globalData.goods.get(Number(option.GoodsId)),
       bookedMyself: app.globalData.goods.get(Number(option.GoodsId)).Bookperson == app.globalData.userInfo.nickName
     })
  },
  bookGoods() {
    
    wx.request({
      url: app.globalData.cloudFunctions.bookGoods,
      data: {
        GoodsId: this.data.goodsInfo.GoodsId,
        Bookperson: app.globalData.userInfo.nickName,
      },
      success: res => {
        if (res.data == -1) {
          console.log('发生未知错误，请稍后重试')
        }
        else if (res.data == 0) {
          console.log('预定商品已达数量上限（10个）')
        }
        else if (res.data == -2) {
          console.log('该商品已被其他人预定')
        }
        else if (res.data == 1) {
          // 也可能是自己预定过
          console.log('商品预定成功')
          this.setData({
            bookedMyself: true
          })
        }
        //console.log(res)
      },
      fail: res => {
        console.log('向服务器请求时发生错误，请检查网络连接，稍后重试')
        console.log(res)
      }
    })
  },
})