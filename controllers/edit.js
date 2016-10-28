// index:
var Post = require('../model').Post;
var Comment = require('../model').Comment;
var Statistic = require('../model').Statistic;
var markdown = require('markdown').markdown;

module.exports = {
    'GET /edit/:aid': async (ctx, next) => {
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
            if (ctx.state.user.name === article.name) {
                ctx.renderNoE('edit.html', {
                    signin: signin,
                    title: 'blog',
                    article: article
                });
            } else {
                if (ctx.state.user)
                    ctx.response.redirect('/article/' + aid);
                else {
                    ctx.response.redirect('/login');
                }
            }
        }
    },

    'POST /edit/:aid': async (ctx, next) => {
        var post = ctx.request.body.text;
        var aid = ctx.params.aid;
        var article = await Post.findOne({
            where: {
                id: aid
            }
        })
        //article.post = post;
        //await article.save();
        await article.update({
            post: post
        })
        ctx.response.redirect('/article/' + aid);
    },

    'GET /delete/:aid': async (ctx, next) => {
        var aid = ctx.params.aid;
        var article = await Post.findOne({
            where: {
                id: aid
            }
        })
        //article.post = post;
        //await article.save();
        if (ctx.state.user.name === article.name) {
            await article.destroy({
                where: {
                    id: aid
                }
            });
            await Comment.destroy({
                where: {
                    parent: aid
                }
            });
            await Statistic.destroy({
                where: {
                    pid: aid
                }
            })
            ctx.response.redirect('/');
        } else {
            if (ctx.state.user)
                ctx.response.redirect('/article/' + aid);
            else {
                ctx.response.redirect('/login');
            }
        }
    },
};
