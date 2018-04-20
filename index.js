
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

global.kullanicilar = {};

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

function query(sql, callback){
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        callback(result);
    });
}

io.on('connection', function (socket) {
    socket.on('register', function(user1, callback){
        con.query("SELECT * FROM users WHERE username = '" + user1 + "'", function (err, result) {
            if (err) throw err;
            if(result.length == 0){//böyle bir kullanıcı yoksa
                var sql = "insert into users values('" + user1 + "', 0);";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    callback(true);
                });
            }
            else{
                console.log("Zaten bu isme sahip bir kullanıcı var.");
                callback(false);
            }
            
          });
        
        
    });

    socket.on('login', function(user, callback){
        con.query("SELECT username FROM users WHERE username='" + user + "'", function (err, result, fields) {
            if (err) throw err;

            if(result.length == 1){
                socket.username = user;
                global.kullanicilar[user] = socket;
                con.query("UPDATE users SET onlinedurum = 1 WHERE username='" + user + "';");
                callback(true);
            }
            else{
                callback(false);
            }
        });
    });

    socket.on('set users', function(setUsers){
        query("SELECT * FROM users", setUsers);
    });

    socket.on('user selected', function(user1, user2, callback){
        query("select * from izinler where user1='" + user1 + "' and user2='" + user2 + "';", function(result){
            if(result.length == 0){
                callback('<div class="izin-istegi1"><h5>Bu kullanıcı ile çetleşmek için izniniz bulunmamaktadır.</br>İzin isteğinde bulunmak ister misiniz?</h5><div class="btn-group"><button class="btn btn-primary btn-lg button" type="button" id="evet">Evet</button><button class="btn btn-primary btn-lg button" type="button" id="hayir">Hayır</button></div></div>');
            }
            else if(result[0].istek == 1){
                callback('<div class="izin-istegi1">Gönderdiğiniz izin isteği beklemede...</br></div>');
            }
            else if(result[0].izin == 0){
                callback('<div class="izin-istegi1">Bu kullanıcı sizinle çetleşmek istemiyor!</br></div>')
            }
            else{
                callback(false);
            }
        });
    });

    socket.on('izin istegi', function(user1, user2){
        query("insert into izinler values('" + user1 + "','" + user2 + "', 0, 1);", function(result){});
        global.kullanicilar[user2].emit('izin istegi', user1);
    });

    socket.on('message', function(message, user1, user2){
        /*con.query("SELECT * FROM izinler WHERE (user1='" + user1 + "' and user2='" + user2 + "') and izin=" + 1 + ";", function (err, result, fields) {
            if (err) throw err;
            if(result.length == 1){*/
                con.query("INSERT INTO messages(user1, user2, message, okundu) values('" + user1 + "','" + user2 +"','" + message + "', 0);", function (err, result, fields) {
                    if (err) throw err;
                    console.log("mesaj eklendi");
                });
            /*}
        });*/
    });

    socket.on('get perm reqs', function(user2, callback){
        query("select * from izinler where user2='" + user2 + "' and istek=1;", callback);
    });

    socket.on('set perm', function(user1, user2, perm){
        console.log('set perm aldı');
        console.log(user1 + " " + user2);
        query("update izinler set istek=0, izin=" + perm + " where user1='" + user1 + "' and user2='" + user2 + "';", function(result){
            console.log('izinler güncellendi');
            console.log(result);
            global.kullanicilar[user1].emit('perm res', perm, user1);
            console.log('perm res gönderilmiş olmalı');
        });
    });

    socket.on('disconnect', function(){
        con.query("UPDATE users SET onlinedurum = 0 WHERE username='" + socket.username + "';");
        con.query("SELECT * FROM users", function (err, result, fields) {
            if (err) throw err;
            socket.broadcast.emit('refresh users', result);
        });
    });
});