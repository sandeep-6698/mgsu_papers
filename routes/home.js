const router = require('express').Router();
const Download = require('../app/controllers/Download.Controller')
const Department = require('../app/controllers/Department.Controller');
const helper = require('../app/middelwares');

//get routes
router.get('/', (req, res) => {
    res.redirect('/home');
})
router.get('/home', Department.fetchAll);
router.get('/paperList', helper.loginRedirect, Download.paperList)
module.exports = router;