// pages/Game/Game.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketOpen:false,
    isend:false,
    winnerinfo:"",
    MovedChess:null,
    roomname:null,
    myname:"玩家一",
    othername:"玩家二",
    mychess:null,
    otherchess:null,
    isfirst:null,
    nowturn:0,
    isMyTurn:null,
    ismyturn:"",
    isotherturn:"",
    chess0:"",
    chess1:"",
    chess2:"",
    chess3:"",
    chess4:"",
    chess5:"",
    chess6:"",
    chess7:"",
    chess8:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getShareInfo({
      success:res=>{
        console.log(res.data);
      }
    });

    try {
      console.log(wx.getStorageSync('roomname'));
      console.log(wx.getStorageSync('myname'));
      console.log(wx.getStorageSync('othername'));
      console.log(wx.getStorageSync('isfirst'));
      this.setData({
        roomname : wx.getStorageSync('roomname'),
        myname : wx.getStorageSync('myname'),
        othername : wx.getStorageSync('othername'),
        isfirst : wx.getStorageSync('isfirst')==="true",
      });
      if(this.data.isfirst){
        this.setData({
          isMyTurn:true,
          mychess:"X",
          otherchess:"O",
          ismyturn:"我的回合:",
          isotherturn:"",
        });
      }else if(!this.data.isfirst){
        this.setData({
          isMyTurn:false,
          mychess:"O",
          otherchess:"X",
          ismyturn:"",
          isotherturn:"对面回合:",
        });
      }else{
        throw new Error("playerInfoError");
      }
      
    } catch (e) {
      // Do something when catch error
      console.log("获取对局信息出错");
    } finally {
      this.data.mychess=((this.data.isfirst)?"X":"O");
    }
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    wx.connectSocket({
      url: 'wss://www.hljingziqi.top',
    });

    wx.onSocketOpen((result) => {
      if(!this.data.socketOpen){
        this.setData({
          socketOpen:true
        });
      }
    });

    wx.onSocketClose((result) => {
      wx.showToast({
        title: '连接中断',
      });
    });
    this.game();
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.closeSocket({
      code: 5,
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

  game:function (){
    
    if(!this.hasOneWin()){
      let nowstep=this.data.nowturn+1;
      this.setData({
        nowturn:nowstep
      });
      let that=this;
      if(this.data.isMyTurn){
        new Promise(function(res,rej){
          let interval=setInterval(()=>{
            if(that.data.MovedChess){console.log(that.data.socketOpen);
              clearInterval(interval);
              that.setData({
                isMyTurn:false,
                ismyturn:"",
                isotherturn:"对面回合",
              })
              let socketMsg=["submitType=gameInfo&roomName="+that.data.roomname+"&nowStep="+that.data.nowturn+"&chessNo="+that.data.MovedChess];
              
                  console.log("twoplayergame172-"+that.data.socketOpen);
                  setTimeout(function sendMsg(){
                    for(let i=0;i<socketMsg.length;i++){
                      if(that.data.socketOpen){
                        wx.sendSocketMessage({
                          data: socketMsg[i],
                        });
                      }else{
                        socketMsg.push(socketMsg[i]);
                      }
                    }
                    socketMsg=[];
                    res(that.data.MovedChess); 
                    
                  },200);      
                 
            }else if(that.data.restart){
              clearInterval(interval);
              return;
            }
          },200);
          
        }).then((data)=>{
          that.setData({
            MovedChess:null,
          });
          that.setChess(data,that.data.mychess);
          that.game();          
          
        });
      }else{
       new Promise(function(res,rej){
        let socketMsg=["submitType=getOtherStep&roomName="+that.data.roomname+"&nowStep="+that.data.nowturn];
          setTimeout(function getinfotimeout(){
                setTimeout(function sendMsg(){
                  if(that.data.socketOpen){
                    wx.sendSocketMessage({
                      data: socketMsg[0],
                    });
                     
                  wx.onSocketMessage((result) => {
                      let chessNo=result.data.split("=")[1];
                      if(chessNo!=null && chessNo.match(/^chess([0-9]+)$/)){
                        res(chessNo);
                      }else{
                        setTimeout(getinfotimeout,250);
                      }
                    });
                  }
                  else{
                    setTimeout(sendMsg,200);
                  }
                },200);
              
          },200);
          
       }).then(data=>{
        that.setChess(data,that.data.otherchess); 
        that.setData({
          isMyTurn:true,
          ismyturn:"我的回合",
          isotherturn:"",
        });   
        that.game();
       });
      }
    }else{
      this.setData({
        isend:true
      });
      switch(this.hasOneWin()){
        case this.data.mychess:
          this.setData({
            winnerinfo:"你赢了"
          });
        break;
        case this.data.otherchess:
          this.setData({
            winnerinfo:"你输了"
          });
        break;
        case 'n':
          this.setData({
            winnerinfo:"平局"
          });
        break;
      }
      console.log("winner:"+this.hasOneWin());
      return;
    }
   
  },
  hasOneWin:function (){
    if(this.data.chess0!=="" && this.data.chess0===this.data.chess1 && this.data.chess1===this.data.chess2 ){
      return this.data.chess0;
    }else if(this.data.chess3!=="" && this.data.chess3===this.data.chess4 && this.data. chess4===this.data.chess5){
      return this.data.chess3;
    }else if(this.data.chess6!=="" && this.data.chess6===this.data.chess7 && this.data.chess7===this.data.chess8){
      return this.data.chess6;
    }else if(this.data.chess0!=="" && this.data.chess0===this.data.chess3 && this.data.chess3===this.data.chess6){
      return this.data.chess0;
    }else if(this.data.chess1!=="" && this.data.chess1===this.data.chess4 && this.data.chess4===this.data.chess7){
      return this.data.chess1;
    }else if(this.data.chess2!=="" && this.data.chess2===this.data.chess5 && this.data.chess5===this.data.chess8){
      return this.data.chess2;
    }else if(this.data.chess0!=="" && this.data.chess0===this.data.chess4 && this.data.chess4===this.data.chess8){
      return this.data.chess0;
    }else if(this.data.chess2!=="" && this.data.chess2===this.data.chess4 && this.data.chess4===this.data.chess6){
      return this.data.chess2;
    }else if(this.data.chess0!=="" && this.data.chess1!=="" && this.data.chess2!=="" && this.data.chess3!=="" && this.data.chess4!=="" && this.data.chess5!=="" && this.data.chess6!=="" && this.data.chess7!=="" && this.data.chess8!==""){
      return "n";
    }
    return null;
  },

  restart:function(){
    if(this.data.isend){
      if(this.data.isfirst){
        this.setData({
          isMyTurn:true,
          mychess:"X",
          otherchess:"O",
          ismyturn:"我的回合:",
          isotherturn:"",
        });
      }else if(!this.data.isfirst){
        this.setData({
          isMyTurn:false,
          mychess:"O",
          otherchess:"X",
          ismyturn:"",
          isotherturn:"对面回合:",
        });
      }
      this.setData({
        isend:false,
        winnerinfo:"",
        MovedChess:null,
        nowturn:0,
        chess0:"",
        chess1:"",
        chess2:"",
        chess3:"",
        chess4:"",
        chess5:"",
        chess6:"",
        chess7:"",
        chess8:"",
      });
      let that=this;
      new Promise((res,rej)=>{
        let socketMsg=["submitType=restartGame&roomName="+that.data.roomname];
        setTimeout(function getinfotimeout(){
              setTimeout(function sendMsg(){
                if(that.data.socketOpen){
                  wx.sendSocketMessage({
                    data: socketMsg[0],
                  });
                   
                wx.onSocketMessage((result) => {
                    if(result.data === "clearsuccess"){
                      res("success");
                    }else{
                      setTimeout(getinfotimeout,250);
                    }
                  });
                }
                else{
                  setTimeout(sendMsg,200);
                }
              },200);
            
        },200);
      }).then(()=>{
        this.game();
      });
    }
    else{
      wx.showToast({
        title: '结束后才可重开',
        icon:"none",
        duration:1200
      })
    }
  },

  setChess:function(str,chesstype){
    switch(str){
      case "chess0":
        this.setData({
          chess0:chesstype
        });
      break;
      case "chess1":
        this.setData({
          chess1:chesstype
        });
      break;
      case "chess2":
        this.setData({
          chess2:chesstype
        });
      break;
      case "chess3":
        this.setData({
          chess3:chesstype
        });
      break;
      case "chess4":
        this.setData({
          chess4:chesstype
        });
      break;
      case "chess5":
        this.setData({
          chess5:chesstype
        });
      break;
      case "chess6":
        this.setData({
          chess6:chesstype
        });
      break;
      case "chess7":
        this.setData({
          chess7:chesstype
        });
      break;
      case "chess8":
        this.setData({
          chess8:chesstype
        });
      break;
    }
  },

  cbtn0:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess0===""){
      this.setData({
        MovedChess:"chess0"
      });console.log(this.data.MovedChess);
    }
  },
  
  cbtn1:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess1===""){
      this.setData({
        MovedChess:"chess1"
      });console.log(this.data.MovedChess);
    }
  },

  
  cbtn2:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess2===""){
      this.setData({
        MovedChess:"chess2"
      });console.log(this.data.MovedChess);
    }
  },
  
  cbtn3:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess3===""){
      this.setData({
        MovedChess:"chess3"
      });console.log(this.data.MovedChess);
    }
  },
  
  cbtn4:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess4===""){
      this.setData({
        MovedChess:"chess4"
      });console.log(this.data.MovedChess);
    }
  },
  
  cbtn5:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess5===""){
      this.setData({
        MovedChess:"chess5"
      });console.log(this.data.MovedChess);
    }
  },
  
  cbtn6:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess6===""){
      this.setData({
        MovedChess:"chess6"
      });
      console.log(this.data.MovedChess);
    }
  },
  
  cbtn7:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess7===""){
      this.setData({
        MovedChess:"chess7"
      });
      console.log(this.data.MovedChess);
    }
  },
  
  cbtn8:function(e){
    if(this.data.isMyTurn && !this.data.MovedChess && this.data.chess8===""){
      this.setData({
        MovedChess:"chess8"
      });console.log(this.data.MovedChess);
    }
  },

})