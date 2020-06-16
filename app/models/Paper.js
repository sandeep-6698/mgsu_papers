const mongoose = require('mongoose');
let paper = new mongoose.Schema({
    paper_name: { type: String, required: true },
    year: { type: String, required: true },
    sem: { type: Number, required: true },
    status: { type: Boolean, default: false },
    sub_id: { type: mongoose.Schema.ObjectId, ref: "subjects", required: true }
}, { timestamps: true });
module.exports = mongoose.model('Paper', paper);