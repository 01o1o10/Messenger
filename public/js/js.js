$(document).ready(function(){
    var socket = io.connect('http://localhost:1111');

    $('#giris').click(function(){
        $('.giris').show();
        $('.main').hide();
        $('.kaydol').hide();
    });

    $('#kaydol').click(function(){
        $('.kaydol').show();
        $('.main').hide();
        $('.giris').hide();
    });

    $('#register-form').submit(function(e){
        e.preventDefault();

        var username = $('#rusername').val();
        socket.emit('register', username);
        $('.kaydol').hide();
        $('.main').show();
    });

    $('#login-form').submit(function(e){
        e.preventDefault();

        var username = $('#rusername').val();
        socket.emit('login', username, function(data){
            if(data){
                $('.giris').hide();
                $('#messenger').show();
            }
            else{
                alert('Böyle bir kullanıcı yok!\nVeya kullanıcı adını yanlış girdiniz!');
            }
        });
    });




/*

    $('#login-form').submit(function (e){
        e.preventDefault();
        $.getJSON('https://ipapi.co/json/', function(data) {
            var ip = data.ip;
            var veri = {nick: $('#nick').val(), ip: ip };
            $('.container').children().remove();
            $('.container').append('<div class="col-sm-3 left-sidebar"><ul class="list-group userlist"></ul></div><div class="col-sm-9 content"></div>');
            socket.emit('yeni kullanici', veri);
        });
    });

    socket.on('kullanicilistele', function(users){
        $('.userlist').children().remove();
        for(var i in users){
            if(users[i].onlinedurum){
                $('.userlist').append('<li class="list-group-item user-list-item">' + users[i].nick + '<div class="online"></div></li>');
            }
            else{
                $('.userlist').append('<li class="list-group-item user-list-item">' + users[i].nick + '<div class="offline"></div></li>');
            }
        }
    });*/
});