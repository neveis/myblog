// index:
var Post = require('../model').Post;
var Comment = require('../model').Comment;
var Statistic = require('../model').Statistic;
var markdown = require('markdown').markdown;
var crypto = require('crypto');

module.exports = {
    'GET /article/:aid': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            signin = true;
        }
        var aid = ctx.params.aid;
        var article = await Post.findOne({
            where: {
                id: aid
            }
        })
        if (article) {
            article.post = markdown.toHTML(article.post);
            if (article.tags)
                article.tags = JSON.parse(article.tags);
            var sta = await Statistic.findOne({
                where: {
                    pid: aid
                }
            });
            if (sta) {
                sta.pv++;
                sta.save();
                article.pv = sta.pv || 0;
                article.cl = sta.cl || 0;
            } else {
                article.pv = 0;
                article.cl = 0;
            }
            var comments = await Comment.findAll({
                where: {
                    parent: aid
                },
                order: 'createdAt DESC',
            })
            comments.forEach(function (comment) {
                //comment.avatarUrl = "https://www.gravatar.com/avatar/123e171ff10c763dd8b9620adc05dce6?s=48"
                var date = new Date(comment.createdAt);
                comment.time = date.toLocaleString();
                var hash = crypto.createHash('md5');
                comment.avatarUrl = 'https://www.gravatar.com/avatar/' + hash.update(comment.email.toLowerCase()).digest('hex') + '?s=48';
            })
            ctx.renderNoE('article.html', {
                signin: signin,
                user: ctx.state.user,
                title: 'blog',
                article: article,
                comments: comments
            });
        }
    },

    'POST /comment/:aid': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            signin = true;
        }
        var aid = ctx.params.aid;
        var author = ctx.request.body.nickname;
        var email = ctx.request.body.email;
        var text = ctx.request.body.text;
        console.log(author, email, text);
        await Comment.create({
            author: author,
            email: email,
            text: text,
            parent: aid
        });
        var sta = await Statistic.findOne({
            where: {
                pid: aid
            }
        });
        if (sta) {
            sta.cl++;
            sta.save();
        }
        ctx.response.redirect('/article/' + aid);
    }
};
