const db = require('../db');

module.exports = db.defineModel('Statistics', {
    pid: db.STRING(100),
    pv: db.INTEGER,
    cl: db.INTEGER,
});
