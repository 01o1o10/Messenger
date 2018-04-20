$(document).ready(function(){
    var socket = io.connect('http://localhost:1111');
    var username;
    var selectedUsername;

    ///SELECTORS

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

        username = $('#lusername').val();
        socket.emit('get perm reqs',  username, setPerReqs);
        socket.emit('login', username, function(data, ){
            if(data){
                $('.header').hide();
                $('.giris').hide();
                $('.messenger').show();
                socket.emit('set users', setUsers);
            }
            else{
                $('.giris').append('<h5 style="color: red; text-align: center;">Kullanıcı adı geçersiz!</br>Kontrol ederek tekrar deneyiniz.</h5>');
            }
        });
    });

    $(document).on('click', 'tr', function(){///user selection
        $('.content').children().remove();
        selectedUsername = $(this).children().children().first().next().html();
        socket.emit('user selected', username, selectedUsername, function(message){
            if(message){
                $('.content').append(message);
            }
            else{
                $('#message-form').show();
            }
            $('.izin-istegi1 #evet').click(function(){
                $('.content').children().remove();
                socket.emit('izin istegi', username, selectedUsername);
                $('.content').append('<div class="izin-istegi1">İstek gönderildi!</br></div>');
            });
            $('.izin-istegi1 #hayir').click(function(){
                $('.content').children().remove();
            });
        });
    });
    
    $(document).on('click', '#kabulet', function(){
        var user = $(this).attr('username');
        $(this).parent().prev().remove();
        $(this).parent().remove();
        alert('kabul edildi');
        setPerm(1, user);
    });

    $(document).on('click', '#reddet', function(){
        var user = $(this).attr('username');
        $(this).parent().prev().remove();
        $(this).parent().remove();
        setPerm(0, user);
    });


    $('#message-submit').click(function(){
        var message = $('#message').val();
        socket.emit('message', message, username, selectedUsername);
        $('.content').append('<div class="message"><p style="font-size: 1em; float: right;">' + message +'</p></div>');
    });

    ///EVENTS

    socket.on('refresh users', function(users){
        setUsers(users);
    });
    
    socket.on('izin istegi', function(user1){
        $('.dropdown-menu').append('<p><strong style="color: blue;">' + user1 + '</strong> sizinle çetleşmek istiyor.<p><div class="btn-group"><button class="btn btn-primary btn-sm button" type="button" id="kabulet" username="' + user1 + '">Kabulet</button><button class="btn btn-primary btn-sm button" type="button" id="reddet" username="' + user1 +  '">Reddet</button></div></div><hr>');
        //ses çıkar
    });

    socket.on('perm res', function(perm, user2){
        alert('perm resi aaldı');
        if(selectedUsername == user2){
            alert('hala aynı kullanıcının mesajları açık');
            alert('izin sonucu' + perm);
            if(perm){
                alert('contenti temizleyip mesajlaşma kısmını göstermesi lazım');
                $('.content').children().remove();
                $('#message-form').show();
            }
            else{
                alert('content e red cevabını vermesi lazım')
                $('.content').append('<div class="receiver-message"><p style="font-size: 1em; color: red;">İstek reddedildi!</p></div>');
            }
        }
    });

    ///FUNCTİONS
    function setPerm(perm, user){
        console.log(username + " " + user);
        alert('set perm i gönderecek');
        socket.emit('set perm', user, username, perm);
    }

    function setUsers(users){
        $('#users-tbody').children().remove();
        for(var i in users){
            if(users[i].username != username){
                if(users[i].onlinedurum){
                    $('#users-tbody').append('<tr><td><div class="online"></div><p>' + users[i].username +'</p></td></tr>');
                }
                else{
                    $('#users-tbody').append('<tr><td><div class="offline"></div><p>' + users[i].username +'</p></td></tr>');
                }
            }
        }
    }

    function setPerReqs(perReqs){
        $('.dropdown-menu').children().remove();
        for(var i in perReqs){
            $('.dropdown-menu').append('<p><strong style="color: blue;">' + perReqs[i].user1 + '</strong> sizinle çetleşmek istiyor.<p><div class="btn-group"><button class="btn btn-primary btn-sm button" type="button" id="kabulet" username="' + perReqs[i].user1 + '">Kabulet</button><button class="btn btn-primary btn-sm button" type="button" id="reddet" username="' + perReqs[i].user1 +  '">Reddet</button></div></div><hr>');
        }
    }
});