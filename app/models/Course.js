var mongoose = require('mongoose');
let course = new mongoose.Schema({
    course_name: { type: String, required: true },
    yearly: { type: Boolean, required: true, default: false },
    num_year_sem: { type: Number, required: true },
    dep_id: {  type: mongoose.Schema.ObjectId, ref: "departments", required: true }
}, { timestamps: true });
module.exports = mongoose.model('Course', course);