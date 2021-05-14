// pages/personal/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     servers:[]
  },
  onLoad: function () {
    var listService = [
      {
        title: '买家服务',
        items: [{
          name: '预定记录',
          url: '/pages/record/index',
          icon: '../../icons/eye.png',
          code: '11'
        },
        {
          isBind: true,
          name: '我的收藏',
          url: '',
          icon: '../../icons/eye.png',
          code: '11'
        }
        ]
      },

      {
        title: '卖家服务',
        items: [{
          name: '我的发布',
          url: '',
          icon: '../../icons/eye.png',
          code: '11'
        },{
          name: '交易记录',
          url: '',
          icon: '../../icons/eye.png',
          code: '11'
        }
        ]
      },
      {
        title: '个人信息',
        items: [{
          isBind: true,
          name: '昵称修改',
          url: '',
          icon: '../../icons/eye.png',
          code: '11'
        },
        {
          isBind: true,
          name: '头像修改',
          url: '',
          icon: '../../icons/eye.png',
          code: '11'
        },{
          isBind: true,
          name: '黑名单',
          url: '',
          icon: '../../icons/eye.png',
          code: '11'
        }
        ]
      }
    ]
    this.setData({
      servers: listService
    })
  },

  /**
   * 当点击Item的时候传递过来
   */
  bindNavigator: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })

  },
})
