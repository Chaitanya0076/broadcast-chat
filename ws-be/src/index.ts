import { WebSocketServer, WebSocket } from 'ws';

interface User {
    socket: WebSocket;
    roomId : string;
}

interface ParedJsonMsg {
    type: string;
    payload:{
        message: string;
        roomId : string;
    }
}

const wss = new WebSocketServer({ port:8080});

let allSockets:User[] = [];

wss.on("connection", (socket)=>{
    socket.on("message", (msg:string)=>{
        console.log("beforeParsing",msg);
        const parsedJson:ParedJsonMsg = JSON.parse(msg);
        console.log("AfterParsing",parsedJson);
        if(parsedJson.type === "join"){
            allSockets.push({
                socket: socket,
                roomId: parsedJson.payload.roomId
            })
        }
        if(parsedJson.type === "chat"){
            const currentUserRoom = allSockets.find(soc => soc.socket === socket)?.roomId;

            if(currentUserRoom){
                allSockets.forEach((user)=>{
                    if(user.roomId === currentUserRoom)
                        user.socket.send(parsedJson.payload.message);
                })
            }
        }
    })
})