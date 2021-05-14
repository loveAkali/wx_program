// pages/add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  uploadGoods() {
    // TODO: 获取输入
    getApp().globalData.userInfo.nickName = 'zyn'
    this.data.bigCategory = 0
    this.data.goodsName = '8848钛金手机'
    this.data.goodsInfo = '你值得拥有'
    this.data.price = 8848
    // TODO：获取图片URL，MD5
    var imgUrl = 'https://7ixia-1305778170.cos.ap-beijing.myqcloud.com/2021-5-3/16200377725721e0224f165d12a67375be969c083e4b3175726.png'
    var imgMd5 = '1e0224f165d12a67375be969c083e4b3'
    wx.request({
      url: app.globalData.cloudFunctions.uploadGoods,
      data: {
        OwnerName: app.globalData.userInfo.nickName,
        Bigcategory: this.data.bigCategory,
        GoodsName: this.data.goodsName,
        Info: this.data.goodsInfo,
        picurl: imgUrl,
        md5: imgMd5,
        Price: this.data.price
      },
      success: res => {
        if (res.data == -1) {
          console.log('发生未知错误，请稍后重试')
        }
        else if (res.data == 0) {
          console.log('每位用户最多只能上传10件商品')
        }
        else {
          console.log('商品发布成功')
          // TODO: 保存返回的商品编号？
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