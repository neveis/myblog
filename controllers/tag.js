// index:
var Post = require('../model').Post;
var markdown = require('markdown').markdown;

module.exports = {
    'GET /tag/:tag': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            signin = true;
        }
        var tag = ctx.params.tag;
        var articles = await Post.findAll({
            attributes: ['id', 'title', 'tags'],
            where: {
                tags: {
                    '$like': '%"' + tag + '"%'
                }
            },
            order: 'createdAt DESC',
        })
        console.log(articles);

        ctx.renderNoE('tag.html', {
            signin: signin,
            user: ctx.state.user,
            title: tag,
            articles: articles
        });
    }
};
