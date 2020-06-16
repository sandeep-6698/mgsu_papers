const multer = require('multer');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('seceret');
exports.checkSession = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        next();
    }
}
exports.loginRedirect = (req, res, next) => {
    if (req.session.user) {
        req.session.user.role ? next() : res.redirect('/');
    }
    else {
        res.redirect('/');
    }
}
exports.loginOperatorRedirect = (req, res, next) => {
    req.session.user ? next() : res.redirect('/');
}
exports.encrypt = password => cryptr.encrypt(password);
exports.decrypt = password => cryptr.decrypt(password);

