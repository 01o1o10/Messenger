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
        socket.emit('login', username, function(data){
            if(data){
                $('.header').hide();
                $('.giris').hide();
                $('.messenger').show(); 
            }
            else{
                $('.giris').append('<h5 style="color: red; text-align: center;">Kullanıcı adı geçersiz!</br>Kontrol ederek tekrar deneyiniz.</h5>');
            }
        });
    });

    $(document).on('click', 'td', function(){///user selection
        $('#message-form').prevAll().remove();
        selectedUsername = $(this).children().first().next().html();
        socket.emit('user selected', username, selectedUsername, function(message){
            if(message){
                $('.content').append(message);
            }
            else{
                $('#message-form').show();
                setMessages();
            }
            $('.izin-istegi1 #evet').click(function(){
                $('#message-form').prevAll().remove();
                socket.emit('izin istegi', username, selectedUsername);
                $('.content').append('<div class="izin-istegi1">İstek gönderildi!</br></div>');
            });
            $('.izin-istegi1 #hayir').click(function(){
                $('#message-form').prevAll().remove();
            });
        });
    });
    
    $(document).on('click', '#kabulet', function(){
        var user = $(this).attr('username');
        $(this).parent().prev().remove();
        $(this).parent().remove();
        setPerm(1, user);
    });

    $(document).on('click', '#reddet', function(){
        var user = $(this).attr('username');
        $(this).parent().prev().remove();
        $(this).parent().remove();
        setPerm(0, user);
    });


    $('#message-form').submit(function(e){
        e.preventDefault();
        
        var message = $('#message').val();
        socket.emit('message', message, username, selectedUsername);
        $('.content').append('<div class="message"><p style="font-size: 1em; float: right;">' + message +'</p></div>');
    });

    ///EVENTS
   
    socket.on('izin istegi', function(user1){
        $('.dropdown-menu').append('<p><strong style="color: blue;">' + user1 + '</strong> sizinle çetleşmek istiyor.<p><div class="btn-group"><button class="btn btn-primary btn-sm button" type="button" id="kabulet" username="' + user1 + '">Kabulet</button><button class="btn btn-primary btn-sm button" type="button" id="reddet" username="' + user1 +  '">Reddet</button></div></div><hr>');
        //ses çıkar
    });

    socket.on('perm res', function(perm, user2){
        if(selectedUsername == user2){
            if(perm){
                $('#message-form').prevAll().remove();
                $('#message-form').show();
            }
            else{
                $('#message-form').prevAll().remove();
                $('.content').append('<div class="receiver-message"><p style="font-size: 1em; color: red;">İstek reddedildi!</p></div>');
            }
        }
    });

    socket.on('message', function(message, sender){
        if(sender == selectedUsername){
            $('.content').append('<div class="receiver-message"><p style="font-size: 1em;">' + message + '</p></div>');
        }
    });

    $('.exit').click(function(){
        $('.messenger').hide();
        $('.giris').show();
        $('.header').show();
        socket.emit('disc', username);
        socket.emit('disconnect');
    });

    ///FUNCTİONS
    function setPerm(perm, user){
        socket.emit('set perm', user, username, perm);
    }

    socket.on('refresh users', setUsers);

    function setUsers(users){
        console.log('refreshed');
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

    function setMessages(){
        socket.emit('set messages', username, selectedUsername, function(messages){
            for(var i in messages){
                if(messages[i].user1 == username){
                    $('.content').append('<div class="sender-message"><p style="font-size: 1em;">' + messages[i].message + '</p></div>');
                }   
                else{
                    $('.content').append('<div class="receiver-message"><p style="font-size: 1em;">' + messages[i].message + '</p></div>');
                }
            }
        });
    }

    function setPerReqs(perReqs){
        $('.dropdown-menu').children().remove();
        for(var i in perReqs){
            $('.dropdown-menu').append('<p><strong style="color: blue;">' + perReqs[i].user1 + '</strong> sizinle çetleşmek istiyor.<p><div class="btn-group"><button class="btn btn-primary btn-sm button" type="button" id="kabulet" username="' + perReqs[i].user1 + '">Kabulet</button><button class="btn btn-primary btn-sm button" type="button" id="reddet" username="' + perReqs[i].user1 +  '">Reddet</button></div></div><hr>');
        }
    }
});