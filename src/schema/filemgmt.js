const mongoose = require("mongoose");
const {Schema} = mongoose;

const fileSchema = new Schema({
    filename:{type:String,required:true},
    filepath:{type:String,required:true},
    filesize:{type:Number,required:true}
},{timestamps:true});

module.exports = mongoose.model("Filemgmt",fileSchema);