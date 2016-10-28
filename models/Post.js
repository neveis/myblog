const db = require('../db');

module.exports = db.defineModel('posts', {
    name: db.STRING(100),
    title: db.STRING(100),
    post: db.TEXT,
    tags: db.STRING(100)
});
