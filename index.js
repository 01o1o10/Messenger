
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

global.kullanicilar = [];

app.use('/public', express.static(path.join(__dirname, 'public'))); 
app.use('/views', express.static(path.join(__dirname, 'views'))); 

server.listen(1111);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
    console.log(socket.connected);
    console.log("clietnden bağlantı var");
    socket.on('event', function (data) {
        global.kullanicilar.push(data);
        console.log(global.kullanicilar);
    });
});