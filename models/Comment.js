const db = require('../db');

module.exports = db.defineModel('comments', {
    author: db.STRING(100),
    email: db.STRING(100),
    parent: db.STRING(100),
    text: db.TEXT
});
