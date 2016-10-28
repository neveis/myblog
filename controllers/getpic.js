// get picture
const mime = require('mime');
const fs = require('mz/fs');
const sharp = require('sharp');
//const images = require("images");
module.exports = {
    'GET /pic/:filename': async (ctx, next) => {
        var filename = ctx.params.filename;
        var fpath = 'uploads/pictures/' + filename;
        if (await fs.exists(fpath)) {
            ctx.response.type = mime.lookup(fpath);
            var file;
            if (ctx.request.query.width) {
                var width = parseInt(ctx.request.query.width, 10)
                file = await sharp(fpath).resize(width).toBuffer();
            } else {
                file = await fs.readFile(fpath);
            }
            //var a = images(fpath).size(300).encode("jpg", { operation: 50 });
            ctx.response.body = file;
        } else {
            ctx.response.status = 404;
        }
    }
};
