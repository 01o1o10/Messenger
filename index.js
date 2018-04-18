
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');

app.use('/public', express.static(path.join(__dirname, 'public'))); 
app.use('/views', express.static(path.join(__dirname, 'views'))); 

server.listen(1111);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

global.kullanicilar = [];

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AZNp5415893"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    con.query("use messenger");
    console.log("DB Connect successful!");
  });

io.on('connection', function (socket) {

    socket.on('register', function(data, callback){
        con.query("SELECT * FROM users WHERE username = '" + data + "'", function (err, result) {
            if (err) throw err;
            if(result.length == 0){
                var sql = "insert into users values('" + data + "', 0);";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    callback(true);
                });
            }
            else{
                console.log("Bu Kullanici ismi doludur.");
                callback(false);
            }
            
          });
        
        
    });

    socket.on('login', function(data, callback){
        con.query("SELECT username FROM users WHERE username='" + data + "'", function (err, result, fields) {
            if (err) throw err;

            if(result.length == 1){
                callback(true);
            }
            else{
                callback(false);
            }
        });
    });

    //bağlantıı olduğunda bunlar çalışacak.

    /*var userinfo;
    socket.on('yeni kullanici', function (data) {
        
    });

    socket.on('disconnect', function(data){
        if(userinfo in global.kullanicilar){
            global.kullanicilar[global.kullanicilar.indexOf(userinfo)].onlinedurum = false;
            socket.broadcast.emit('kullanicilistele', global.kullanicilar);
            console.log('bir kullanıcı offline oldu');
            console.log(global.kullanicilar);
        }
    });*/

    socket.on('disconnect', function(){
        //bağlantı kesildiğinde bu fonksiyon çalışır
    });
});