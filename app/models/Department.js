const mongoose = require("mongoose");
let department = new mongoose.Schema({
    dep_name:{ type:String, required:true },
    dep_descript:{ type:String, required:true },
    dep_img:{ type:String, required:true }
})
module.exports = mongoose.model('Department',department);