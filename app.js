const url = require('url');

const Cookies = require('cookies');

const Koa = require('koa');

const logger = require('koa-logger')

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const app = new Koa();

// log request URL:
app.use(logger())
/*
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    //ctx.response.set('X-Response-Time', `${execTime}ms`);
});
*/
// parse user from cookie:
app.use(async (ctx, next) => {
    ctx.state.user = parseCookies(ctx.cookies.get('user') || '');
    await next();
});

// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating.templating('view', {
    noCache: true,
    watch: true
}));

// add nunjucks as view:
app.use(templating.templatingNoE('view', {
    autoescape: false,
    noCache: true,
    watch: true
}));

// add controller middleware:
app.use(controller());

function parseCookies(obj) {
    if (!obj) {
        return;
    }
    //console.log('try to parse ', obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('user');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            //console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}

let server = app.listen(3000);

console.log('app started at port 3000...');

