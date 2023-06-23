const mongoose = require("mongoose");
const {Schema} = mongoose;

const fileSchema = new Schema({
    filename:{type:String,required:true},
    filepath:{type:String,required:true},
    filesize:{type:Number,required:true},
    isPrivate:{type:Boolean,default:false},
    uploadedBy:{type:mongoose.Types.ObjectId,required:true,ref:"User"}
},{timestamps:true});

module.exports = {fileModel:mongoose.model("Filemgmt",fileSchema)};