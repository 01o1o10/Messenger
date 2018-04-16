var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
 
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    fs.readFile('./views/index.html', function(err, data){
        res.write(data);
        res.end('mesaj bitti');
        console.log('homecontroller');
    });
});

app.get('/login', function(req, res){
    fs.readFile('login.html', function(err, data){
        res.write(data);
        res.end('mesaj bitti');
        console.log('logincontrller');
    });
});

app.listen(1111);
console.log('server çalışıyor');