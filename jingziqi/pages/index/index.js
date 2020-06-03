//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '欢乐井字棋',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  findRoom:function(){
      if(this.data.hasUserInfo){
        wx.navigateTo({
          url: '../findRoom/findRoom',
        });
      }else{
        this.hasNotLogin();
      }
  },
  createRoom:function(){
      if(this.data.hasUserInfo){
        wx.navigateTo({
          url: '../createRoom/createRoom'
        });
      }else{
        this.hasNotLogin();
      }
  },
  onePlayerGame:function(){
    if(this.data.hasUserInfo){
      wx.navigateTo({
        url: '../Game/Game'
      });
    }else{
      this.hasNotLogin();
    }
},
  getAppInfo:function(){
      if(this.data.hasUserInfo){
        wx.navigateTo({
          url: '../aboutApp/aboutApp',
        })
      }else{
        this.hasNotLogin();
      }
  },
  hasNotLogin(){
    wx.showToast({
      title: '请先登录',
      icon:"none",
      duration:1200
    })
  }
});


