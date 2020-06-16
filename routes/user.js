const router = require('express').Router();
const User = require('../app/controllers/User.Controller');
const helper = require('../app/middelwares');

router.get('/', helper.loginRedirect, User.fetchAll);
router.get('/updateUser/:id', helper.loginRedirect, User.updateUser)
router.get('/deleteUser/:id', helper.loginRedirect, User.delUser);
router.get('/logout', helper.loginRedirect, User.logout)

router.post('/signup', helper.loginRedirect, User.addNew);
router.post('/updateUser', helper.loginRedirect, User.updateUser);
router.post('/login', helper.checkSession, User.login)
module.exports = router;
