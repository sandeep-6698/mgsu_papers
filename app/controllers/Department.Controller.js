const department = require('../models/Department');
const course = require('../models/Course');
const subject = require('../models/Subject');
const paper = require('../models/Paper');
const fs = require('fs');
//departments metods
exports.addDepart = (req, res) => {
    let file = req.files.dep_img;
    let filename = Date.now() + file.name;
    file.mv('public/images/' + filename, (err, res) => {
        if (err) throw err;
    })
    dep_data = new department({
        dep_name: req.body.dep_name,
        dep_descript: req.body.dep_descript,
        dep_img: filename
    })
    dep_data.save((err) => {
        if (err) throw err;
        console.log("Data Submited Success");
    })
    req.flash("message", "Department added Successfully");
    req.flash("type", "success")
    res.redirect('/department');
}
exports.fetchAll = (req, res) => {
    department.find({}, (err, data) => {
        if (err) throw err;
        res.render('index', { title: "mgsu paper", page: "Download/index", dep_data: data });
    })
}
exports.depIndex = (req, res) => {
    department.find({}, (err, data) => {
        if (err) throw err;
        res.render('index', { title: "Department Management", page: "Department/index", dep_data: data });
    })
}


//courses methods

exports.addCourses = (req, res) => {
    let courses = req.body.course;
    courses.forEach(element => {

        if (element.length < 3) {
            let tmp = element[1];
            element[1] = '0';
            element[2] = tmp;
        }
        let c_data = new course({
            course_name: element[0],
            yearly: element[1],
            num_year_sem: element[2],
            dep_id: req.body.dep_id
        });
        c_data.save((err, data) => {
            if (err) throw err;
            console.log('Data submitted successfully');
        })
    });
    req.flash("message", "Courses added Successfully");
    req.flash("type", "success")
    res.redirect('back');
}
exports.updateCourses = (req, res) => {
    if (req.params.id) {
        course.find({ 'dep_id': req.params.id }, (err, data) => {
            res.render('index', { title: "Update Courses", page: "Department/updateCourses", data: data });
        });
        return;
    }

    req.body.course.forEach(element => {
        if (element.length < 4) {
            let tmp = element[2];
            element[2] = '0';
            element[3] = tmp;
        }
        let c_data = {
            course_name: element[1],
            yearly: element[2],
            num_year_sem: element[3]
        };
        course.findByIdAndUpdate(element[0], c_data, (err, data) => {
            if (err) throw err;
            console.log('Data submitted successfully');
        })
    })
    req.flash("message", "Courses Spdated Successfully");
    req.flash("type", "success")
    res.redirect('back');

};


//subjects methods

exports.subList = (req, res) => {
    subject.find({ course_id: req.params.id }, (err, data) => {
        res.render('index', { title: "Update Subjects", page: "Department/subList", data: data, yearly: req.params.yearly });
    })
}
exports.addSub = (req, res) => {
    if (req.params.id) {
        res.render('index', { title: "Add New Subjects", page: "Department/addSub", yearly: req.params.yearly, num_year_sem: req.params.num_year_sem, id: req.params.id });
        return;
    }
    var sem = 1;
    req.body.sub.forEach(sub => {
        for (var i = 0; i < sub.length; i++) {
            if (sub[i] != '') {
                let s_data = new subject({
                    sub_name: sub[i],
                    sem: sem,
                    course_id: req.body.course_id
                })
                s_data.save((err, data) => {
                    if (err) throw err;
                    console.log("Data inserted successfully");
                })
            }
        }
        sem++;
    })
    req.flash("message", "Subjects added Successfully");
    req.flash("type", "success")
    res.redirect('back');
};
exports.updateSub = (req, res) => {
    if (req.params.id) {
        subject.findById(req.params.id, (err, sub_data) => {
            if (err) throw err;
            course.findById(sub_data.course_id, (err, course_data) => {
                console.log(course_data);
                res.render('index', { title: "Update Subjects", page: "Department/updateSub", sub_data: sub_data, course_data: course_data });
            })
        })
        return;
    }
    let sub_data = {
        sub_name: req.body.sub_name,
        sem: req.body.sem
    }
    subject.findByIdAndUpdate(req.body.sub_id, sub_data, (err, data) => {
        if (err) throw err;
        console.log('Data Submited');
    })
    req.flash("message", "Subject Updated Successfully");
    req.flash("type", "success")
    res.redirect('back');
};

//delete department
exports.delDep = (req, res) => {
    course.find({ dep_id: req.params.dep_id }, { _id: 1 }, (err, res) => {
        if (err) throw err;
        subject.find({ course_id: { $in: res } }, { _id: 1 }, (err, res) => {
            if (err) throw err;

            paper.find({ sub_id: { $in: res } }, { paper_name: 1 }, (err, paper) => {
                if (err) throw err;
                paper.forEach(data => {
                    fs.unlink('public/papers/' + data.paper_name, (err, res) => {
                        if (err) throw err;
                    });
                })
            })

            paper.deleteMany({ sub_id: { $in: res } }, { _id: 1 }, (err, res) => {
                if (err) throw err;
            }).then(() => {
                subject.deleteMany({ _id: { $in: res } }, (err, status) => {
                    if (err) throw err;
                })
            })
        }).then(() => {
            course.deleteMany({ _id: { $in: res } }, (err, status) => {
                if (err) throw err;
            })
        })
    }).then(() => {
        department.findByIdAndDelete(req.params.dep_id, (err, res) => {
            if (err) throw err;
            fs.unlink('public/images/'+res.dep_img,(err,status)=>{
                if(err) throw err;
            });
            console.log("Department deleted");
        })
    })
    res.redirect('back');
}

exports.delCourse = (req, res) => {

    subject.find({ course_id: req.params.course_id }, { sub_id: 1 }, (err, res) => {

        paper.find({ sub_id: { $in: res } }, { paper_name: 1 }, (err, paper) => {
            if (err) throw err;
            paper.forEach(data => {
                fs.unlink('public/papers/' + data.paper_name, (err, res) => {
                    if (err) throw err;
                });
            })
        }).then(() => {
            paper.deleteMany({ sub_id: { $in: res } }, { _id: 1 }, (err, res) => {
                if (err) throw err;
            })
        })
    }).then(() => {
        subject.deleteMany({ course_id: req.params.course_id }, (err, res) => {
            if (err) throw err;
        })
    }).then(() => {
        course.findByIdAndDelete(req.params.course_id, (err, data) => {
            console.log("Course deleted");
        })
    })
    res.redirect('back');
}
exports.delsub = (req, res) => {
    paper.find({ sub_id: req.params.sub_id }, { paper_name: 1 }, (err, paper) => {
        if (err) throw err;
        paper.forEach(data => {
            fs.unlink('public/papers/' + data.paper_name, (err, res) => {
                if (err) throw err;
            });
        })
    })

    paper.deleteMany({ sub_id: req.params.sub_id }, (err, res) => {
        if (err) throw err;
    }).then(() => {
        subject.findByIdAndDelete(req.params.sub_id, (err, res) => {
            if (err) throw err;
            console.log("Subject deleted");
        })
    })
    res.redirect('back');
}