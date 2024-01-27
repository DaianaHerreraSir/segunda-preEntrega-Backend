const socket = io()

socket.on('connect', () => {
    console.log('Conectado al servidor de sockets');
  });

let user 

Swal.fire({
    title:"Bienvenido",
    input: "text",
    text:"Nombre de usuario",
    inputValidator: value => {
        return !value && "Ingrese por favor el nombre de usuario"
    },
    allowOutsideClick: false
}).then(result =>{
    user= result.value
    console.log(user);
})




const chatbox = document.querySelector("#chatbox");

chatbox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
            socket.emit("message", { user, message: chatbox.value });
            chatbox.value = ""; 
        }
    }
});

socket.on('messageLogs', data => {
    // console.log(data)
    let messageLogs = document.querySelector('#messageLogs')
    let mensajes = ''
    data.forEach(mensaje => {
       mensajes += `<li>${mensaje.user} dice: ${mensaje.message}</li>` 
    })
    messageLogs.innerHTML = mensajes
})
// const chatbox = document.querySelector("#chatbox");

// chatbox.addEventListener("keyup", (evt) => {
//     if (evt.key === "Enter") {
//         if (chatbox.value.trim().length > 0) {
//             socket.emit("message", { user, message: chatbox.value });
//             chatbox.value = ""; 
//         }
//     }
// });

// socket.on('messageLogs', data => {
//     // data ahora contiene el nuevo mensaje, así que puedes agregarlo al DOM directamente
//     let messageLogs = document.querySelector('#messageLogs')
//     messageLogs.innerHTML += `<li>${data.user} dice: ${data.message}</li>`;
// });
