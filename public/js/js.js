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
        socket.emit('register', username, function(data){
            if(data){
                alert("Kayıt başarılı!\nGiriş sayfasına yönlendirileceksiniz.");
                $('.kaydol').hide();
                $('.giris').show();
            }
            else{
                $('.kaydol').append('<h5 style="color: red; text-align: center;">Bu kullanıcı adı kayıtlı. Başka bir kullanıcı adı seçiniz!</h5>');
            }
        });
    });

    $('#login-form').submit(function(e){
        e.preventDefault();

        var username = $('#lusername').val();
        socket.emit('login', username, function(data, ){
            if(data){
                alert('giriş başarılı!');
                $('.giris').hide();
                $('#messemger').show();
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
            $('.container').append('');
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