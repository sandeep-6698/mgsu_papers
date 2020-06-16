const mongoose = require('mongoose');
let subject = new mongoose.Schema({
    sub_name: { type: String, required: true },
    sem: { type: Number, required: true },
    course_id: { type: mongoose.Schema.ObjectId, ref: "courses", required: true }
}, { timestamps: true });
module.exports = mongoose.model('Subject', subject);