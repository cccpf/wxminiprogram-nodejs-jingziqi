// pages/Game/Game.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winnerinfo:"",
    restart:false,
    myname:"我",
    othername:"笨笨机器人",
    nowturn:1,
    isMyTurn:true,
    MovedChess:null,
    chessType:"X",
    otherChessType:"O",
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

  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
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
  
  game: function(){
    if(!this.hasOneWin()){
      let that=this;
      if(this.data.isMyTurn){
        new Promise(function(res,rej){
          let interval=setInterval(()=>{
            if(that.data.MovedChess){
              clearInterval(interval);
              that.setData({
                isMyTurn:false
              })
              res(that.data.MovedChess);    
            }else if(that.data.restart){
              clearInterval(interval);
              return;
            }
          },20);
          
        }).then((data)=>{
          that.setData({
            MovedChess:null,
          });
          that.setChess(data,that.data.chessType);
          that.game();          
          
        });
      }else{
       new Promise(function(res,rej){
        res(that.getNextStep());
       }).then(data=>{
        that.setChess(data,that.data.otherChessType); 
        that.setData({
          isMyTurn:true
        });   
        that.game();
       });
      }
    }else{
      switch(this.hasOneWin()){
        case this.data.chessType:
          this.setData({
            winnerinfo:"你赢了"
          });
        break;
        case this.data.otherChessType:
          this.setData({
            winnerinfo:"笨笨机器人赢得了比赛"
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

  restart:function(){
    console.log(this.data.restart);
    this.setData({
      restart:true,
      winnerinfo:"",
      myname:"我",
      othername:"笨笨机器人",
      nowturn:1,
      isMyTurn:true,
      MovedChess:null,
      chessType:"X",
      otherChessType:"O",
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
    setTimeout(function(){
      that.setData({
        restart:false
      });
      that.game();
    },30);
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

  getNextStep:function(){
    if(this.data.chess4===""){
      return "chess4";
    }
    let chessboard=[this.data.chess0,this.data.chess1,this.data.chess2,this.data.chess3,this.data.chess4,this.data.chess5,this.data.chess6,this.data.chess7,this.data.chess8];
    let res0=this.hasOneWillWin(chessboard,this.data.otherChessType),res1;
    if(res0==null){
      res1=this.hasOneWillWin(chessboard,this.data.chessType);
    }
    if(res0!=null){
      return res0;
    }else if(res1!=null){
      return res1;
    }else{
      let temparr=[];
      for(let i=0;i<chessboard.length;i++){
        if(chessboard[i]===""){
          temparr.push(i);
        }
      }
      if(temparr.length==0){
        return undefined;
      }else{
        return "chess"+temparr[Math.floor(Math.random()*(temparr.length-1))];
      }
    }  
  },

  hasOneWillWin:function(chessarr,type){
   for(let i=0;i<chessarr.length;i++){
     if(chessarr[i]===""){
      let newca=[];
      for(let j=0;j<chessarr.length;j++){
        newca[j]=chessarr[j];
      }
      newca[i]=type;
      if(this.checkIsWin(newca,type)){
        return "chess"+i;
      }
     }
   }
   return null;
  },

  checkIsWin:function(chessarr,type){
    let indexarr=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[3,5,8],[0,4,8],[2,4,6]];
    for(let i=0;i<indexarr.length;i++){
      let a=chessarr[indexarr[i][0]],b=chessarr[indexarr[i][1]],c=chessarr[indexarr[i][2]];
      if( a === type && a === b && b === c ){
        return true;
      }
    }
    return false;
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
  }
})