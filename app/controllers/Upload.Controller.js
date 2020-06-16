const department = require('../models/Department');
const course = require('../models/Course');
const subject = require('../models/Subject');
const paper = require('../models/Paper');

exports.index = (req, res) => {
    department.find({}, (err, dep_data) => {
        if (err) throw err;
        res.render('index', { title: "Upload", page: "Upload/index", dep_data: dep_data });
    })
};

exports.getCourse = (req, res) => {
    course.find({ dep_id: req.body.dep_id }, (err, data) => {
        //console.log(data);
        res.render('Upload/getCourse', { course_data: data });
    });
};

exports.getSem = (req, res) => {
    course.findById(req.body.course_id, (err, data) => {
        if (err) throw err;
        res.render('Upload/getSem', { course_data: data });
    });
}

exports.getSub = (req, res) => {
    subject.find({ course_id: req.body.course_id, sem: req.body.sem }, (err, data) => {
        res.render('Upload/getSub', { sub_data: data });
    })
}

exports.submitPaper = (req, res) => {
    let file = req.files.paper_name;
    let papername = Date.now() + file.name;
    file.mv('public/papers/' + papername, (err, res) => {
        if (err) throw err;
    })
    req.body.paper_name = papername;
    let paper_data = new paper(req.body);
    paper_data.save((err, data) => {
        if (err) throw err;
        console.log("Paper uploaded successfully")
    })
    req.flash("message", "Paper Uploaded Successfully");
    req.flash("type", "success")
    res.redirect('/upload');
}