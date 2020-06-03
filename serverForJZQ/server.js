const https=require('https');
const fs=require('fs');
const path=require('path');
const WebSocket=require('ws');
const websocket=require('ws').Server;

const roommap=new Map(); 

const config={
    port:443,
    ssl_key:'****.key',         //购买服务器后的秘钥和证书           
    ssl_cert:'****.pem',
}

const processrequest=(req,res)=>{
    res.writeHead(200);
    res.end('https!\n');
};

const app=https.createServer({
    key:fs.readFileSync(path.join(__dirname,config.ssl_key), 'utf8'),
    cert:fs.readFileSync(path.join(__dirname,config.ssl_cert), 'utf8'),
},processrequest);

const wss=new websocket({
    server:app,
});

wss.on("connection",(wsconnect,req)=>{
    console.log("已连接websocket");
    let dataarr;
    wsconnect.on('message',(message)=>{
        console.log("接收到"+message);
        dataarr=message.split("&");
        let postdata={"ip":req.socket.remoteAddress};
        for(let i=0;i<dataarr.length;i++){
            postdata[dataarr[i].split("=")[0]]=dataarr[i].split("=")[1];
        }
        if(postdata.submitType === "CreateRoom"){
            if(roommap.has(postdata.roomName) ){
                wsconnect.send('createFail');
            }else{
                roommap.set(postdata.roomName,new Room(postdata.roomName,postdata.ownerName,postdata.roomPsw,postdata.playerOrder=='o'));
                let room=roommap.get(postdata.roomName);
                room.setOwnerIP(postdata.ip);
                wsconnect.send('createSuccess');
            }    
        }
        else if(postdata.submitType === "JoinRoom"){
            let room=roommap.get(postdata.roomName);
            if(room != null && room.pswIsRight(postdata.roomPsw) && room.isNotFull()){       
                room.setOtherIP(postdata.otherip);
                room.setOtherName(postdata.otherName);
                wsconnect.send('ownername='+room.ownername+"&isFirst="+!room.ownerIsFirst);
                
                wss.clients.forEach(function each(client) {
                    if (client !== wsconnect && client.readyState === WebSocket.OPEN) {
                    client.send("roomname="+room.roomname+"&othername="+room.othername);
                    console.log("roomname="+room.roomname+"&othername="+room.othername);
                    }
                });
                 
            }else{
                wsconnect.send('findFail');
            }
        }
        else if(postdata.submitType === "gameInfo"){
            let room=roommap.get(postdata.roomName);
            if(room != null ){
                room.chessboard[postdata.nowStep]=postdata.chessNo;
                if(room.hasInit)room.hasInit=false;
            }
        }
        else if(postdata.submitType === "getOtherStep"){
            let room=roommap.get(postdata.roomName);
            if(room != null ){
                if(room.chessboard[postdata.nowStep]!=null){
                    let chessno=room.chessboard[postdata.nowStep];
                    wsconnect.send('chessNo='+chessno);
                }else{
                    wsconnect.send('chessNo=null');
                }
                
            }else{
                wsconnect.send('chessNo=null');
            }
        }
        else if(postdata.submitType === "restartGame"){
            let room=roommap.get(postdata.roomName);
            if(room!=null){
                if(!room.hasInit){
                    room.InitChessBoard();
                    wsconnect.send('clearsuccess');
                }else{
                    wsconnect.send('clearsuccess');
                }
            }else{
                wsconnect.send('GameIsOver');
            }
        }
        else{
            wsconnect.send("dataFormatError");
        }
             
    });
    
}); 

app.on('request',function(req,res){
    console.log('收到请求，客户端地址为：',req.socket.remoteAddress,req.socket.remotePort);
});

app.listen(config.port,(req,res)=>{
    console.log("服务器已启动");
});

class Room{
    constructor(roomname,ownername,roompsw,playerorder){
        this.roomname=roomname;
        this.roompsw=roompsw;
        this.ownername=ownername;
        this.ownerip=null;
        this.othername=null;
        this.otherip=null;
        this.ownerIsFirst=playerorder;
        this.hasInit=true;
        this.chessboard={"1":null,"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null};
    }

    InitChessBoard(){
        this.chessboard={"1":null,"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null};
        this.hasInit=true;
    }

    setOwnerIP(ip){
        this.ownerip=ip;
    }

    setOtherIP(ip){
        this.otherip=ip;
    }

    setOtherName(name){
        this.othername=name;
    }

    pswIsRight(psw){
        return this.roompsw === psw;
    }

    isNotFull(){
        return this.othername == null;
    }
}
