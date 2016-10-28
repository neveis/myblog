// index:
var Post = require('../model').Post;
var Statistic = require('../model').Statistic;
var markdown = require('markdown').markdown;

module.exports = {
    'GET /': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            signin = true;
        }
        var perPage = 10;
        var currentPage = parseInt(ctx.request.query.p, 10) || 1;
        var result = await Post.findAndCountAll({
            order: 'createdAt DESC',
            limit: perPage,
            offset: perPage * (currentPage - 1)
        });
        var statistics = await Statistic.findAll();
        var count = result.count;
        var articles = result.rows;
        var totalPage = Math.ceil(count / perPage);
        var pageList;
        if (currentPage < 3) {
            pageList = (() => {
                var list = [];
                for (var i = 1; i <= (totalPage < 5 ? totalPage : 5); i++) {
                    list.push(i);
                }
                return list;
            })();
        } else if (currentPage > totalPage - 2) {
            pageList = (() => {
                var list = [];
                for (var i = (1 < (totalPage - 4) ? (totalPage - 4) : 1); i <= totalPage; i++) {
                    list.push(i);
                }
                return list;
            })();
        } else {
            pageList = (() => {
                var list = [];
                for (var i = currentPage - 2; i <= currentPage + 2; i++) {
                    list.push(i);
                }
                return list;
            })();
        }
        articles.forEach(function (article) {
            article.post = markdown.toHTML(article.post);
            for (var i = 0; i < statistics.length; i++) {
                if (statistics[i].pid == article.id)
                    break;
            }
            if (i != statistics.length) {
                article.pv = statistics[i].pv;
                article.cl = statistics[i].cl;
                statistics.splice(i, 1);
            } else {
                article.pv = 0;
                article.cl = 0;
            }
            if (article.tags)
                article.tags = JSON.parse(article.tags);
        })
        ctx.renderNoE('index.html', {
            signin: signin,
            user: ctx.state.user,
            title: 'blog',
            articles: articles,
            currentPage: currentPage,
            pageList: pageList,
            isFirstPage: currentPage === 1,
            isLastPage: currentPage === totalPage
        });
    }
};
