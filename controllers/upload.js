// upload:

module.exports = {
    'GET /upload': async (ctx, next) => {
        var signin = false;
        if (ctx.state.user) {
            signin = true;
            ctx.render('upload.html', {
                signin: signin,
                title: 'upload',
            });
        } else {
            ctx.response.redirect('/login')
        }
    },

    'POST /upload': async (ctx, next) => {
        if (ctx.state.user) {
            ctx.response.redirect('/')
        } else {
            ctx.response.redirect('/login')
        }
    }
};
