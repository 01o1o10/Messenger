$(document).ready(function(){

    $('#giris').click(function(){
        $.getJSON('https://ipapi.co/json/', function(data) {
            var ip = data.ip;
            var veri = {nick: $('#nick').val(), ip: ip };
            var socket = io.connect('http://localhost:1111');
            socket.emit('event', veri);
            window.location = "http://localhost:1111/views/messenger.html";
        });
    });
});