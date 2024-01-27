// socket.emit(event, data) // emit an event to the socket identified by the string name
// socket.broadcast.emit(event, data) // emit an event to all connected clients except the one that sent the message
// io.emit(event, data) // emit an event to all connected clients

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("a user connected");
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
        
})

http.listen(3010, function(){
    console.log('listening on *:3010');
});
