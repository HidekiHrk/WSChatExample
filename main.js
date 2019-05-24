const WebSocket = require('ws');
const fs = require('fs');
var wss = new WebSocket.Server({port:8000});

var chat_file_path = "./chat.txt"

function add_message(txt){
    let text = fs.readFileSync(chat_file_path).toString(encoding="utf-8");
    text += `${txt}<br>`;
    fs.writeFileSync(chat_file_path, text, {encoding:'utf-8'});
}

function read_text(){
    return fs.readFileSync(chat_file_path).toString(encoding="utf-8");
}

wss.on('connection', ws => {
    ws.on('message', msg => {
        let message = JSON.parse(msg.toString());
        console.log(message);
        if(!message.type){
            ws.send("error");
        }
        switch(message.type){
            case "connect":
                ws.send(JSON.stringify({type:"update", data:{text:read_text()}}));
                break;
            case "message":
                add_message(`${message.data.name}: ${message.data.text}`);
                ws.send(JSON.stringify({type:"update", data:{text:read_text()}}));
                break;
        }
    });
});

const interval = setInterval(() => {
    wss.clients.forEach(async ws => {
        ws.send(JSON.stringify({type:"update", data:{text:read_text()}}));
    })
}, 500)