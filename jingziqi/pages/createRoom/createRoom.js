// pages/createRoom/createRoom.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    RoomName:"",
    RoomPsw:"",
    PlayerOrder:"o",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket({
      code: 0,
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket({
      code: 1,
    });
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

  },

  createRoom:function(){
    if(this.data.RoomName == null || this.data.RoomName === ""){
      wx.showToast({
        title: '您需先添加房间名',
        icon: "none",
        duratiom:"1200"
      });
 
    }else{
      console.log("RoomName="+this.data.RoomName);
      console.log("RoomPsw="+this.data.RoomPsw);
      console.log("PlayerOrder="+this.data.PlayerOrder);
      console.log("ownerName="+this.data.userInfo.nickName);
      let socketOpen=false;
      let socketMsgQueue=["submitType=CreateRoom"+"&roomName="+this.data.RoomName+"&roomPsw="+this.data.RoomPsw+"&playerOrder="+this.data.PlayerOrder+"&ownerName="+this.data.userInfo.nickName];
      wx.connectSocket({
        url: 'wss://www.hljingziqi.top',
      });

      wx.onSocketOpen((result) => {
        socketOpen=true;
        for(let i=0;i<socketMsgQueue.length;i++){
          if(socketOpen){
            wx.sendSocketMessage({
              data: socketMsgQueue[i],
            });
          }else{
            socketMsgQueue.push(socketMsgQueue[i]);
          }
        }
        socketMsgQueue=[];
      });
    
      wx.onSocketMessage((result) => { 
        if(result.data === "createSuccess"){
          wx.showLoading({
            title: '等待他人进入',
          });

          wx.onSocketMessage((result) => {
            let dataarr=result.data.split('&');
            if(dataarr[0].split('=')[1] === this.data.RoomName){
              wx.hideLoading({
                complete: (res) => {
                  console.log("othername="+dataarr[1].split('=')[1]);
                  try {
                    wx.setStorageSync("roomname", this.data.RoomName);
                    wx.setStorageSync( "myname", this.data.userInfo.nickName);
                    wx.setStorageSync( "othername", dataarr[1].split('=')[1]);
                    wx.setStorageSync("isfirst",this.data.PlayerOrder==="o"?"true":"false");
                  } catch (e) { 
                    console.error("设置对局信息错误");
                  } finally{
                    wx.navigateTo({
                      url: '/pages/twoplayergame/twoplayergame',
                    });
                  }
                  
                },
              })
            }
          })

        }else if(result.data === "createFail"){
          wx.showToast({
            title: '房间号正被使用',
            duration:2000,
          });
        }else if(result.data === "dataFormatError"){
          wx.showToast({
            title: '连接服务器失败',
            duration:2000,
          });
        }
      });   
    }
  },


  setRoomName:function(d){
    this.setData({
      RoomName:d.detail.value 
    });
  },

  setRoomPsw:function(d){
    this.setData({
      RoomPsw:d.detail.value
    });
  },

  setPlayerOrder:function(d){
    this.setData({
      PlayerOrder:d.detail.value[0]
    });
  },
})