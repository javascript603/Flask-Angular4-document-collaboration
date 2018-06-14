var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send("Hello")
});
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('my_event', function(msg){
    console.log(msg)
    io.emit('my_response', {'data': msg['data'], 'senderid': msg['senderid'] ,'len': msg['len'] });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
http.listen(5000, function(){
  console.log('listening on *:5000');
});