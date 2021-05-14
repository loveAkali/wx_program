// this.js
App({
  login() {
    console.log(this.globalData.openID)
    wx.request({
      url: this.globalData.cloudFunctions.searchOpenID,
      data: {
        openid: this.globalData.openID
      },
      success: res => {
        //console.log('登录成功?')
        console.log(res)
        if (res.data.Status == -1) {
          console.log('数据库查询发生未知错误，请重试')
        }
        else if (res.data.Status == 0) {
          // TODO: 弹输入框提示新用户输入昵称
          console.log('新用户')
        }
        else if (res.data.Status == 1) {
          this.globalData.userInfo.nickName = res.data.nickName
          this.globalData.userInfo.status = res.data.Num
          // TODO: 跳转到主页面
          console.log('登录成功')
        }
      },
      fail: res => {
        console.log('向服务器请求登录时发生错误，请检查网络连接')
        console.log(res)
      }
    })
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey
        if(res.code) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo.wxNickName = res.userInfo.nickName;
              this.globalData.userInfo.wxAvatarUrl = res.userInfo.avatarUrl;
            }
          });
          var wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.globalData.appID}&secret=${this.globalData.appSecret}&js_code=${res.code}&grant_type=authorization_code`
          //return
          wx.request({  
            url: wxUrl,
            success: res => {
              this.globalData.openID = res.data.openid
              this.globalData.sessionKey = res.data.sessionKey
              this.login()
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  globalData:{
    appID: 'wx416d0555b8f0b23c', // 填小程序的AppID和AppSecret
    appSecret: '206b10b94cbc5782c43d7ead5838c663', // 填小程序的AppSecret
    openID: '', // 微信用户唯一标识
    sessionKey: '',
    goods: new Map(),
    userInfo: {
      wxNickName: '',  // 微信昵称
      wxAvatarUrl: '', // 微信头像(url)
      nickName: '', // 小程序昵称,
      avatar: '',   // 小程序头像
      status: Infinity,
    },
    cloudFunctions: {
      searchOpenID: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/SearchOpenId',
      register: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/CreateNickname',
      getOldStudentCardImg: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/GetUserInfo',
      changeUserInfo: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/ChangeUserInfo',
      getGoods: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/GetGoods',
      uploadGoods: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/UploadGoods',
      deleteGoods: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/DeleteGoods',
      reportGoods: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/Report',
      bookGoods: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/BookGoods',
      cancelBook: 'https://service-f69sbzdx-1303022844.cd.apigw.tencentcs.com/release/CancelBook',
    }
  },
})
