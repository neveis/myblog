// register:
var User = require('../model').User;
var crypto = require('crypto');

module.exports = {
    'GET /register': async (ctx, next) => {
        if (ctx.state.user) {
            ctx.response.redirect('back');
        } else {
            ctx.render('register.html', {
                title: 'Register',
            });
        }
    },

    'POST /register': async (ctx, next) => {
        var nickname = ctx.request.body.nickname;
        var password = ctx.request.body.password;
        var email = ctx.request.body.email;
        if (await User.findOne({
            where: {
                '$or': [
                    { name: nickname },
                    { email: email }
                ]
            }
        })) {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: false,
                href: null
            }
        } else {
            var hash = crypto.createHash('md5');
            var user = await User.create({
                name: nickname,
                email: email,
                passwd: hash.update(password).digest('hex')
            });
            console.log('create', JSON.stringify(user));
            var obj = {
                id: user.id,
                name: user.name
            };
            var cookies = Buffer.from(JSON.stringify(obj)).toString('base64');
            ctx.cookies.set('user', cookies);
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: true,
                href: '/'
            }
        }
    },

    'POST /register/checkuname': async (ctx, next) => {
        let nickname = ctx.request.body.nickname
        if (await User.findOne({ where: { name: nickname } })) {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: false,
                message: '用户名已存在'
            }
        } else {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: true,
                message: '用户名可以使用'
            }
        }
    },

};
