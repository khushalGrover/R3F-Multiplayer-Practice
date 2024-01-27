import io from 'socket.io-client';

const joinRoomButton = document.getElementById('room-button');
const roomInput = document.getElementById('room-input');
const roomName = document.getElementById('room-name');
const messageInput = document.getElementById('message-input');
const form = document.getElementById('form');

const socket = io('http://localhost:3000');
socket.on('connect', () => {
    console.log('socket.id', socket.id);
    displayMessage(`You are connected ${socket.id}`);
});

socket.on("recieve-message", message => {
    console.log('message recieve', message);
    displayMessage(message);
});
    


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const room = roomInput.value;
    const message = messageInput.value;

    if(message === '') return;
    displayMessage(message);
    socket.emit('send-message', message, room);
    
    messageInput.value = '';
});


joinRoomButton.addEventListener('click', () => {
    const room = roomInput.value;
    if(roomName === '') return;
    roomName.innerHTML = `Room: ${room}`;
    
    socket.emit('joinRoom', room, message => {
        displayMessage(message);
    });
    
});

function displayMessage(message) {
    const div = document.createElement('li');
    div.textContent = message;
    document.getElementById('message-container').appendChild(div);
    // io.emit('receive-message', message);
}
