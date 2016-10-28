$(function () {
    function checkPassword() {
        var password = $('input[name=password]').val();
        var cpassword = $('input[name=cpassword]').val();
        if (cpassword.trim() == '') {
            return;
        }
        if (password != cpassword) {
            $('.cp-alert').empty();
            $('.cp-alert').append(`<div class="alert alert-danger">
                        <strong>密码不一致</strong>
                    </div>`)
        } else {
            $('.cp-alert').empty();
            $('.cp-alert').append(`<div class="alert alert-success">
                        <strong>密码相同</strong>
                    </div>`)
        }
    }
    $('input[name=password]').change(checkPassword);
    $('input[name=cpassword]').change(checkPassword);



    function checkUname() {
        var nickname = $('input[name=nickname]').val();
        if (nickname.trim() == '') {
            $('.n-alert').empty();
            return;
        }
        $.post('/register/checkuname', {
            nickname: nickname
        }, function (data, status) {
            console.log("数据: \n" + data + "\n状态: " + status);
            if (data.status) {
                $('.n-alert').empty();
                $('.n-alert').append(`<div class="alert alert-success">
                        <strong>昵称可以使用</strong>
                    </div>`)
            } else {
                $('.n-alert').empty();
                $('.n-alert').append(`<div class="alert alert-danger">
                        <strong>昵称已被使用</strong>
                    </div>`)
            }
        });
    }

    $('input[name=nickname]').change(checkUname);

    $('#register-account').submit(function (e) {
        //console.log($(this).find('input[name=username]').val(), this.password);
        e.preventDefault();
        var nickname = $(this).find('input[name=nickname]').val();
        var password = $(this).find('input[name=password]').val();
        var cpassword = $(this).find('input[name=cpassword]').val();
        var email = $(this).find('input[name=email]').val();
        if (nickname.trim() == '' || password.trim() == '' || password != cpassword) {
            return;
            //console.log("密码不一致");
        }
        else {
            $.post("/register", {
                nickname: nickname,
                email: email,
                password: password
            }, function (data, status) {
                console.log("数据: \n" + data + "\n状态: " + status);
                if (data.status) {
                    window.location.href = data.href;
                } else {
                    console.log("register fail");
                }
            });
        }
    });
});