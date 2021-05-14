const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    nickName: "",
    realName: "",
    studentID: 0
  },
  nickNameInput : function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  realNameInput : function(e){
    this.setData({
      realName: e.detail.value
    })
  },
  IDInput : function(e){
    this.setData({
      studentID: e.detail.value
    })
  },
  welcomeTap: function () {
    wx.switchTab({
      url: '../index/index'
    })
    var app = getApp()
    app.globalData.userInfo.nickName=this.data.nickName
    console.log(app.globalData.userInfo.nickName)
    console.log(this.data.realName)
    console.log(this.data.studentID)
    if (!(/^[\u4E00-\u9FA5A-Za-z0-9]{1,10}$/.test(this.data.nickName))) {
      // TODO: 弹框提示用户昵称不合法
      console.log('昵称为1-10位中英文+数字组合')
      return
    }
    // 真实姓名：1-10位中文
    if (!(/^[\u4E00-\u9FA5]{1,10}$/.test(this.data.realName))) {
      // TODO: 弹框提示用户真实姓名不合法
      console.log('真实姓名为10位以内汉字')
      return
    }
    // 学生证号：8或10位数字
    if (!(/^(\d{8}|\d{10})$/.test(this.data.studentID))) {
      // TODO: 弹框提示用户学号不合法
      console.log('学号为8或10位数字')
      return
    }
    // TODO：图片检查（如果需要）
    console.log(app.globalData.openID)
    console.log(this.data.realName)
    wx.request({
      url: app.globalData.cloudFunctions.register,
      data: {
        openid: app.globalData.openID,
        Nickname: this.data.nickName,
        RealName: this.data.realName,
        StudentNumber: this.data.studentID,
        StudentCard: this.data.studentCardImage
      },
      success: res => {
        if (res.data.Status == -1) {
          // TODO: 弹框提示
          console.log('数据库查询发生未知错误，请重试')
        }
        else if (res.data.Status == 0) {
          // TODO: 弹框提示
          console.log('该昵称已被占用，请输入其他昵称')
        }
        else if (res.data.Status == 1) {
          app.globalData.userInfo.status = 0 // 新用户为未提交审核状态(0)
          // TODO: 弹框提示
          console.log('注册成功，3秒后进入主页面')
          // TOOD: 页面跳转
        }
      },
      fail: res => {
        console.log('向服务器请求登录时发生错误，请检查网络连接')
        console.log(res)
      }
    })
     
  },

  //
  register() {
    // TODO: 输入绑定至nickName, realName, studentID, studentCardImage
    // this.data.nickName = 'zyn'
    // this.data.realName = '张以宁'
    // this.data.studentID = '1120181343'

    // 昵称：中英文+数字，1-10位
    if (!(/^[\u4E00-\u9FA5A-Za-z0-9]{1,10}$/.test(this.data.nickName))) {
      // TODO: 弹框提示用户昵称不合法
      console.log('昵称为1-10位中英文+数字组合')
      return
    }
    // 真实姓名：1-10位中文
    if (!(/^[\u4E00-\u9FA5]{1,10}$/.test(this.data.realName))) {
      // TODO: 弹框提示用户真实姓名不合法
      console.log('真实姓名为10位以内汉字')
      return
    }
    // 学生证号：8或10位数字
    if (!(/^(\d{8}|\d{10})$/.test(this.data.studentID))) {
      // TODO: 弹框提示用户学号不合法
      console.log('学号为8或10位数字')
      return
    }
    // TODO：图片检查（如果需要）
    
    wx.request({
      url: app.globalData.cloudFunctions.register,
      data: {
        openid: app.globalData.openID,
        Nickname: this.data.nickName,
        Realname: this.data.realName,
        StudentNumber: this.data.studentID,
        StudentCard: this.data.studentCardImage
      },
      success: res => {
        if (res.data.Status == -1) {
          // TODO: 弹框提示
          console.log('数据库查询发生未知错误，请重试')
        }
        else if (res.data.Status == 0) {
          // TODO: 弹框提示
          console.log('该昵称已被占用，请输入其他昵称')
        }
        else if (res.data.Status == 1) {
          app.globalData.userInfo.status = 0 // 新用户为未提交审核状态(0)
          // TODO: 弹框提示
          console.log('注册成功，3秒后进入主页面')
          // TOOD: 页面跳转
        }
      },
      fail: res => {
        console.log('向服务器请求登录时发生错误，请检查网络连接')
        console.log(res)
      }
    })
  },




  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
 
 
 
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  clearFont() {
    this.setData({
      placeholder: ''
    })
  },
 
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  login() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  toCropper() {
    wx.navigateTo({
        url: `/cropper/cropper?imgSrc=${this.data.src}`
    })
},
   onShow() { 
    if (app.globalData.imgSrc) {
        this.setData({
            src: app.globalData.imgSrc
        })
    }
},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})