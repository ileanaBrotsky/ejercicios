
//for the chat
//=========================================
const socket = io();
let user = sessionStorage.getItem('user') || '';
let chatBox = document.getElementById("chatBox");

if (!user) {
  Swal.fire({
  // icon: 'error',
  title: "Quién sos?",
  input: "text",
  text: "Debes decirnos tu nombre para estar en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre de usuario para continuar!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  document.getElementById("userName").innerHTML = user;
  sessionStorage.setItem("user", user)
  socket.emit('new', user)
});
}else{
  document.getElementById("userName").innerHTML = user;
  socket.emit('new', user)
}
chatBox.addEventListener("keyup", (evt) => {
   
  if (evt.key ==="Enter") {
    if (chatBox.value.trim().length > 0) {
    console.log('todo bien')
      
    socket.emit("message", { user:user, message: chatBox.value });
      chatBox.value="";
    }
  }
});
socket.on('messagesLogs',data=>{
    let log= document.getElementById('messagesLogs');
    let messages=""
    data.forEach(message=>{
        messages=messages +`${message.user} dice: ${message.message}</br>`
    })
    log.innerHTML=messages;
})

//envio con emit el nombre de la funcion y los datos
socket.emit("message1", "Comunicacion con websocket funcionando!!!");

