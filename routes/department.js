const Department = require('../app/controllers/Department.Controller');
const router = require('express').Router();
const helper = require('../app/middelwares');

router.get('/', helper.loginRedirect, Department.depIndex);
router.get('/addDepartment', (req, res) => {
    res.render('index', { title: "Department management", page: "Department/addDep" });
});
router.get('/delDep/:dep_id', helper.loginRedirect, Department.delDep);

//courses router
router.get('/addCourses/:dep_name/:id', helper.loginRedirect, (req, res) => {
    res.render('index', { title: "Add New Courses", page: "Department/addCourses", dep_name: req.params.dep_name, dep_id: req.params.id });
})
router.get('/updateCourses/:id', helper.loginRedirect, Department.updateCourses);
router.get('/delCourse/:course_id', helper.loginRedirect, Department.delCourse);

//subject router
router.get('/addSub/:yearly.:num_year_sem/:id', helper.loginRedirect, Department.addSub);
router.get('/subList/:yearly/:id', helper.loginRedirect, Department.subList)
router.get('/updateSub/:id', helper.loginRedirect, Department.updateSub);
router.get('/delSub/:sub_id', helper.loginRedirect, Department.delsub);

//post routes
router.post('/department/:id?', helper.loginRedirect, Department.addDepart);
router.post('/addCourses', helper.loginRedirect, Department.addCourses);
router.post('/updateCourses', helper.loginRedirect, Department.updateCourses);
router.post('/addSub', helper.loginRedirect, Department.addSub);
router.post('/updateSub/', helper.loginRedirect, Department.updateSub);
module.exports = router;