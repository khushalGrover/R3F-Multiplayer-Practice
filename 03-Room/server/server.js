const { instrument } = require('@socket.io/admin-ui');

console.log('server.js starting!!');

const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080", "https://admin.socket.io"],
    },

});


// create a set of available users
const availableUsers = new Set();

io.on('connection', socket => {
    console.log('new user');
    console.log('socket.id', socket.id); 
    
    availableUsers.add(socket);
    console.log('Available users: ' + availableUsers.size);

    socket.on('send-message', (message, room) => {
        if (room === '') {
            console.log('message> ', message,'room> ', room);
            socket.broadcast.emit('recieve-message', "ALL: " + message);
        } else  {
            socket.broadcast.to(room).emit('recieve-message', message);
        }
    });

    socket.on('joinRoom', (room, cb) => {
        socket.join(room);
        cb(`room joined: ${room}`);
    });

});

instrument(io, { auth: false });