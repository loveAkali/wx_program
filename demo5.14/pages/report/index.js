// pages/report/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },
  radioChange : function(e){
    this.setData({
     reportReason: e.detail.value
    })
    console.log(this.data.reportReason)
  },
  onLoad(option){
    this.setData({
      goodsId: Number(option.GoodsId)
    })
  },
  reportGoods() {
    // TODO: 获得举报商品ID，举报理由
    getApp().globalData.userInfo.nickName = 'zyn'
    wx.request({
      url: app.globalData.cloudFunctions.reportGoods,
      data: {
        GoodsId: this.data.goodsId,
        reportperson: app.globalData.userInfo.nickName,
        reportreason: this.data.reportReason
      },
      success: res => {
        if (res.data == -1) {
          console.log('该商品已被举报')
          //弹窗
        }
        else if (res.data == 1) {
          console.log('商品举报成功')
          //弹窗
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