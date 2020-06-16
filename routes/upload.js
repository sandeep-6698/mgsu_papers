const router = require('express').Router();
const Upload = require('../app/controllers/Upload.Controller');
const helper = require('../app/middelwares');

router.get('/', helper.loginOperatorRedirect, Upload.index);

router.post('/getCourse', helper.loginOperatorRedirect, Upload.getCourse);
router.post('/getSem', Upload.getSem);
router.post('/getSub', helper.loginOperatorRedirect, Upload.getSub);
router.post('/submitPaper', helper.loginOperatorRedirect, Upload.submitPaper);

module.exports = router;