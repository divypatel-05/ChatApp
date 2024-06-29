const socket = io('http://localhost:8000');

const form = document.getElementById("inputContainer");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
// console.log(messageContainer);
var audio = new Audio('../html/ting.mp3');

socket.on('connect', () => {
    console.log('Connected to server');
});

const userName = prompt("Enter your name");
socket.emit('new-user-joined', userName);

const append = (message, position) => {
    // console.log('Appending message:', message);
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // console.log(messageContainer);
    if(position == "left"){
        audio.play();
    }
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    messageInput.value = '';
    socket.emit('send', message);
})
// console.log(userName);
socket.on('user-joined', name => {
    // console.log('User joined:', name);
    append(`${name} joined the chat`, 'right');
});

socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, "left");
});
socket.on('left', name => {
    append(`${name} left the chat`, "right");
});