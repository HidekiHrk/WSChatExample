var is_connected = false;
var text_input = document.getElementById('text_input');

var ws = new WebSocket("ws://0.0.0.0:8000/");

ws.addEventListener('open', () => {
    is_connected = true;
    ws.send(JSON.stringify({type:"connect"}));
})

var update = async (msg) => {
    let message = JSON.parse(msg.data);
    if(message.type == "update"){
        let chat_block = document.getElementById('chat_block');
        chat_block.innerHTML = message.data.text;
        chat_block.scrollTop = chat_block.scrollHeight;
    }
}

ws.addEventListener('message', update);

ws.addEventListener('error', (err) => {
    document.getElementById('chat_block').innerHTML = 
        "Ocorreu um erro na conexão com o websocket, por favor recarregue a página.";
})

text_input.addEventListener('keydown', function(e){
    if(e.keyCode == 13){
        send_message();
    }
})

function send_message() {
    let msg = document.getElementById('text_input').value;
    let name = document.getElementById('name_input').value;
    if(!is_connected || !msg.length) return;
    document.getElementById('text_input').value = "";
    name = name.length > 0 ? name : 'Guest';
    ws.send(JSON.stringify({type:"message", data:{name: name, text: msg }}));
}