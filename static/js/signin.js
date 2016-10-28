$(function () {

    $('.form-signin').submit(function (e) {
        e.preventDefault();
        var account = $(this).find('input[name=account]').val();
        var password = $(this).find('input[name=password]').val();
        if (account.trim() == '' || password.trim() == '') {
            return;
        } else {
            $.post('/signin', {
                account: account,
                password: password
            }, function (data, status) {
                if (data.status) {
                    window.location.href = '/';
                } else {
                    console.log(data.message);
                }
            })
        }
    });
});