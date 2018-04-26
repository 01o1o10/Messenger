$(document).ready(function(){
    var socket = io.connect('192.168.43.36:1111');
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
        var file = document.getElementById('img').files[0];
        var stream = ss.createStream();
    
        // upload a file to the server.
        ss(socket).emit('register', {image: stream, nickname: username, filename: file.name}, function(data){
            if(data){
                alert("Kayıt başarılı!\nGiriş sayfasına yönlendirileceksiniz.");
                $('.kaydol').hide();
                $('.giris').show();
            }
            else{
                $('.kaydol').append('<h5 style="color: red; text-align: center;">Bu kullanıcı adı kayıtlı. Başka bir kullanıcı adı seçiniz!</h5>');
            }
        });
        ss.createBlobReadStream(file).pipe(stream);
    });

    $('#login-form').submit(function(e){
        e.preventDefault();

        username = $('#lusername').val();
        $('#user').html(username);
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

    $(document).on('click', '#usr', function(){///user selection
        $('.content ul').children().remove();
        selectedUsername = $(this).children().first().next().html();
        $('.current-user h5').html(selectedUsername);
        socket.emit('user selected', username, selectedUsername, function(message){
            if(message){
                $('.content ul').append(message);
            }
            else{
                $('.message-form-wrapper').show();
                setMessages();
            }
            $('.izin-istegi1 #evet').click(function(){
                $('.content ul').children().remove();
                socket.emit('izin istegi', username, selectedUsername);
                $('.content ul').append('<div class="izin-istegi1">İstek gönderildi!</br></div>');
            });
            $('.izin-istegi1 #hayir').click(function(){
                $('.content ul').children().remove();
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


    $('.message-form-wrapper').submit(function(e){
        e.preventDefault();
        
        var message = $('#message').val();
        socket.emit('message', message, username, selectedUsername);
        $('.content ul').append('<li class="sender-message"><p style="font-size: 1em; float: right;">' + message +'</p></li>');
    });

    ///EVENTS
   
    socket.on('izin istegi', function(user1){
        $('.dropdown-menu').append('<p><strong style="color: blue;">' + user1 + '</strong> sizinle çetleşmek istiyor.<p><div class="btn-group"><button class="btn btn-primary btn-sm button" type="button" id="kabulet" username="' + user1 + '">Kabulet</button><button class="btn btn-primary btn-sm button" type="button" id="reddet" username="' + user1 +  '">Reddet</button></div></div><hr>');
        //ses çıkar
    });

    socket.on('perm res', function(perm, user2){
        if(selectedUsername == user2){
            if(perm){
                $('.content ul').children().remove();
                $('.message-form-wrapper').show();
            }
            else{
                $('.content ul').children().remove();
                $('.content ul').append('<li class="receiver-message"><p style="font-size: 1em; color: red;">İstek reddedildi!</p></li>');
            }
        }
    });

    socket.on('message', function(message, sender){
        if(sender == selectedUsername){
            $('.content ul').append('<li class="receiver-message"><p style="font-size: 1em;">' + message + '</p></li>');
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
                console.log(users[i].photo);
                if(users[i].onlinedurum){
                    $('#users-tbody').append('<tr><td id="usr" width="70%"><div class="online"></div><p>' + users[i].username +'</p><img width="40" height="40" src="./../public/userphotos/' +users[i].imgname + '"></td><td></td></tr>');
                }
                else{
                    $('#users-tbody').append('<tr><td id="usr" width="70%"><div class="offline"></div><p>' + users[i].username +'</p><img width="40" height="40" src="./../public/userphotos/' +users[i].imgname + '"></td><td></td></tr>');
                }
            }
        }
    }

    function setMessages(){
        socket.emit('set messages', username, selectedUsername, function(messages){
            for(var i in messages){
                if(messages[i].user1 == username){
                    $('.content ul').append('<li class="sender-message"><p style="font-size: 1em;">' + messages[i].message + '</p></li>');
                }   
                else{
                    $('.content ul').append('<li class="receiver-message"><p style="font-size: 1em;">' + messages[i].message + '</p></li>');
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