$(function () {

    $('#login').submit(function (e) {
        e.preventDefault();
        var userName = $(this).find('input[name=username]').val();
        var password = $(this).find('input[name=password]').val();
        if (userName.trim() == '' || password.trim() == '') {
            return;
        } else {
            $.post('/login', {
                userName: userName,
                password: password
            }, function (data, status) {
                if (data.status) {
                    window.history.back();
                    //window.location.href = document.referrer;
                } else {
                    $('#warning').removeClass('hidden').addClass('show').text(data.message);
                    console.log(data.message);
                }
            })
        }
    });
});