var users = {};

var addUser = function (userName, password) {
    if (userName in users) {
        return false;
    } else {
        users[userName] = password;
        return true;
    }
}

var checkUser = function (userName) {
    if (userName in users) {
        return true;
    } else {
        return false;
    }
}
var getUser = function (userName) {
    if (userName in users) {
        return { userName: userName, password: users[userName] };
    } else {
        return {};
    }
}
module.exports = {
    addUser: addUser,
    checkUser: checkUser,
    getUser: getUser
}