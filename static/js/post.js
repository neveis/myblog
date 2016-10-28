$(function () {


    $('#post').submit(function (e) {
        e.preventDefault();
        var title = $('input[name=title]').val();
        var text = $('textarea[name=text]').val();
        var tags = $('input[name=tags]').val();
        console.log(title);
        console.log(text);
        if (title.trim() == '') {
            $('#warning').removeClass('hidden').addClass('show').text("标题不能为空");
            console.log("标题不能为空")
            return;
        } else {
            $('#warning').removeClass('show').addClass('hidden').text("标题不能为空");
        }
        $.post('/post', {
            title: title,
            text: text,
            tags: tags
        }, function (data, status) {
            console.log("数据: \n" + data + "\n状态: " + status);
            if (data.status) {
                window.location.href = '/';
            } else {
                $('#warning').removeClass('hidden').addClass('show').text("发表失败");
                console.log("post fail");
            }
        })
    });
});