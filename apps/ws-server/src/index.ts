import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT as unknown as number || 8080;

const wss = new WebSocketServer({port});

wss.on("connection",function connection(ws){
    ws.on("message",async function message(msg){
        const data = msg.toString();
        console.log(data);
        ws.send(`Received data : ${data}`);
    })
})