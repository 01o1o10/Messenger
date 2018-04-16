"use strict";

const http = require("http");
const fs = require("fs");
const express = require("express");
const path = require("path");

var app = express();
app.use('./public', express.static(__dirname + 'public'));

var server = http.createServer(function(req, res){
    fs.readFile("index.html", function(err, data){
        res.write(data);
        res.end();
    });
}).listen(1111);
console.log(__dirname + '/public');
console.log("Messenger çalışıyor");