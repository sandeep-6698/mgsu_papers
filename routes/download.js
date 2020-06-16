const Download = require('../app/controllers/Download.Controller');
const router = require('express').Router();
router.get('/:id', Download.viewDownload);
router.get('/view/:paper_name', Download.downloadFile)
router.get('/delete/:id', Download.delete);
router.get('/publish/:id', Download.publish);
//router.get('/pandingPaper',Download.pandingPaper);
router.post('/downloadPaper', Download.downloadPaper);
module.exports = router;