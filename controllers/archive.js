// index:
var Post = require('../model').Post;
var markdown = require('markdown').markdown;

module.exports = {
    'GET /archive': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            signin = true;
        }

        var articles = await Post.findAll({
            order: 'createdAt DESC',
        })

        articles.forEach(function (article) {
            var date = new Date(article.createdAt);
            article.time = {
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate()
            }
        })

        ctx.render('archive.html', {
            signin: signin,
            title: 'archive',
            articles: articles
        });
    }
};
