const paper = require('../models/Paper');
const subject = require('../models/Subject');
const course = require('../models/Course');
const mongoose = require('mongoose');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId;

exports.viewDownload = (req, res) => {
    if (req.params.id) {
        course.find({ dep_id: req.params.id }, { _id: 1, course_name: 1 }, (err, data) => {
            if (err) throw err;
            res.render('index', { title: "Download", page: "Download/download", course_data: data });
        })
    }
}
exports.paperList = (req, res) => {

    paper.aggregate([{ $match: { status: false } },
    {
        $lookup: {
            from: 'subjects',
            localField: 'sub_id',
            foreignField: '_id',
            as: 'subjects'
        }
    }, { $unwind: "$subjects" },
    {
        $lookup: {
            from: 'courses',
            localField: "subjects.course_id",
            foreignField: '_id',
            as: 'courses'
        }
    },
    { $unwind: "$courses" },
    {
        $project: {
            _id: 1,
            sem: 1,
            year: 1,
            paper_name: 1,
            createdAt: 1,
            "subjects.sub_name": 1,
            "courses.course_name": 1,
            "courses.yearly": 1
        }
    }]).exec((err, data) => {
        if (err) throw err;
        res.render('index', { title: "Download", page: "Download/paperList", paper_data: data });
    })
}
exports.delete = (req, res) => {
    paper.findByIdAndDelete(req.params.id, (err,paperdata) => {
        if (err) throw err;
        fs.unlink('public/papers/'+paperdata.paper_name,(err,status)=>{
            if(err) throw err;
        });
        console.log("paper deleted success");
        req.flash("message", "Paper Deleted Successfully");
        req.flash("type", "success")
        res.redirect('back');
    })
}
exports.publish = (req, res) => {
    paper.findByIdAndUpdate(req.params.id, { 'status': true }, (err) => {
        if (err) throw err;
        console.log("paper publishes success");
        req.flash("message", "Paper Published Successfully");
        req.flash("type", "success")
        res.redirect('/paperList');
    })
}
// exports.pandingPaper = (req,res)=>{
//     paper.count( {status: false},(err,num)=>{
//         console.log(num);
//         return num;
//     })
//     //res.render('Download/pandinPaper',{data: 5});
// }

exports.downloadFile = (req, res) => {
    let file = fs.readFileSync('public/papers/' + req.params.paper_name);
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
    res.end();
}


exports.downloadPaper = (req, res) => {
    paper.aggregate([
        {
            $match: {
                $and: [
                    { status: true },
                    { year: req.body.year },
                    { sem: parseInt(req.body.sem) },
                ]
            }
        },
        {
            $lookup: {
                from: "subjects",
                localField: "sub_id",
                foreignField: "_id",
                as: "subjects"
            }
        },
        { $unwind: "$subjects" },
        {
            $lookup: {
                from: "courses",
                localField: "subjects.course_id",
                foreignField: "_id",
                as: "course"
            }
        },
        { $unwind: "$course" },
        { $match: { 'course._id': ObjectId(req.body.course_id) } },
        { $project: { paper_name: 1, sem: 1, year: 1, "subjects.sub_name": 1, "course.course_name": 1, "course.yearly": 1 } }
    ]).exec((err, data) => {
        if (err) throw err;
        res.render('index', { title: "downloa paper", page: 'Download/downloadPaper', paper_data: data })
    })
}