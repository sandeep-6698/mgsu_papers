const user = require('../models/User');
const helper = require('../middelwares');
exports.addNew = (req, res) => {
    user.findOne({ $or: [{ 'email': req.body.email }, { 'mobile': req.body.mobile }] }, (err, data) => {
        if (!data) {
            req.body.password = helper.encrypt(req.body.password);
            var userData = new user({
                username: req.body.username,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                role: req.body.role,
                status: req.body.status
            })
            userData.save((err) => { if (err) console.log(err) })
            req.flash("message", "User added Successfully");
            req.flash("type", "success")
            res.redirect('/user');
            return;
        }
        req.flash("message", "Username or Mobile alrady exists!");
        req.flash("type", "error")
        res.redirect('back');
    });
};

exports.fetchAll = (req, res) => {
    user.find({}, (err, data) => {
        res.render('index', { title: "User management", page: "User/index", data: data });
    })
}

exports.delUser = (req, res) => {
    user.findByIdAndDelete(req.params.id, (err) => {
        if (err) throw err;
        req.flash("message", "User Deleted Successfully");
        req.flash("type", "success")
        res.redirect('/user');
    });
}

exports.updateUser = (req, res) => {
    if (req.params.id) {
        user.findById(req.params.id, (err, data) => {
            data.password = helper.decrypt(data.password);
            res.render('index', { title: "User management", page: "User/update", data: data });
        });
        return;
    }
    req.body.password = helper.encrypt(req.body.password);
    if (req.session.user._id == req.body._id) {
        req.session.user.username = req.body.username;
        req.session.user.password = req.body.password;
        res.locals.user = req.session.user
    }
    user.findByIdAndUpdate(req.body._id, {
        $set: {
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            status: req.body.status
        }
    }, (err, data) => {
        if (err) throw err;
    });
    req.flash("message", "User Updated Successfully");
    req.flash("type", "success")
    res.redirect('/user');
}
exports.login = (req, res) => {
    user.findOne({ $or: [{ 'email': req.body.email }, { 'mobile': req.body.email }] }, (err, data) => {
        if (data) {
            if (helper.decrypt(data.password) == req.body.password) {
                if (data.status) {
                    req.session.user = data;
                    res.locals.user = req.session.user
                    let username = req.session.user.username;
                    let end = username.indexOf(" ");
                    if (username.indexOf(" ") < 0) { end = username.length; }
                    req.flash("welcome", username.slice(0, end).toUpperCase());
                    res.redirect('/upload');
                    return;
                }
                req.flash("message", "You are Blocked, Please contact to admin.");
                req.flash("type", "error")
                res.redirect('/home');
            }
            else {
                console.log("User or password not matched");
                req.flash("message", "User or password not matched");
                req.flash("type", "error")
                res.redirect('/home');
            }
        }
        else {
            req.flash("message", "Please Register as a New User");
            req.flash("type", "error")
            res.redirect('/home');
        }
    })
}
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}