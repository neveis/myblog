const path = require('path');
const fs = require('fs');
const multer = require('koa-multer');
//控制文件的存储
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/pictures')
    },
    filename: function (req, file, cb) {
        console.log("rename", req.body);
        var extname = path.extname(file.originalname);
        var newName = path.parse(req.body.rename).name + extname;
        cb(null, newName);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, true);
        }
    }
});
// add url-route in /controllers:

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    var files = fs.readdirSync(__dirname + '/' + dir);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    }, files);

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    //手动添加
    router.post('/upload', upload.single('pic'));
    //自动扫描
    addControllers(router, controllers_dir);
    return router.routes();
};
