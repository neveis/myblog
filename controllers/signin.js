// sign in:
var User = require('../model').User;
var crypto = require('crypto');

module.exports = {
    'GET /signin': async (ctx, next) => {
        if (ctx.state.user) {
            ctx.response.redirect('back');
        } else {
            ctx.render('signin.html');
        }
    },

    'POST /signin': async (ctx, next) => {
        var account = ctx.request.body.account;
        var password = ctx.request.body.password;
        var user = await User.findOne({
            where: {
                '$or': [
                    { name: account },
                    { email: account }
                ]
            }
        });
        if (user) {
            var hash = crypto.createHash('md5');
            if (hash.update(password).digest('hex') === user.passwd) {
                var obj = {
                    id: user.id,
                    name: user.name
                };

                var cookies = Buffer.from(JSON.stringify(obj)).toString('base64');
                ctx.cookies.set('user', cookies);
                ctx.response.type = 'application/json';
                ctx.response.body = {
                    status: true,
                }
            } else {
                ctx.response.type = 'application/json';
                ctx.response.body = {
                    status: false,
                    message: '密码错误'
                }
            }
        } else {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: false,
                message: '用户不存在'
            }
        }
    },

    'GET /signout': async (ctx, next) => {
        ctx.cookies.set('user', '');
        ctx.response.redirect('/');
    }
};
