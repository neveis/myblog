// post:
var Post = require('../model').Post;
var Statistic = require('../model').Statistic;

module.exports = {
    'GET /post': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            ctx.render('post.html', {
                signin: true,
                title: 'post',
            });
        } else {
            ctx.response.redirect('/login')
        }
    },

    'POST /post': async (ctx, next) => {
        if (ctx.state.user) {
            var tags = ctx.request.body.tags.split(';');
            if (tags[tags.length - 1] == '') {
                tags.pop();
            }
            console.log("tags", tags);
            var post = await Post.create({
                name: ctx.state.user.name,
                title: ctx.request.body.title,
                post: ctx.request.body.text,
                tags: JSON.stringify(tags)
            });
            await Statistic.create({
                pid: post.id,
                pv: 0,
                cl: 0
            });
            
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: true,
                href: '/'
            }
        } else {
            ctx.response.type = 'application/json';
            ctx.response.body = {
                status: true,
                message: '发表失败'
            }
        }
    }
};
