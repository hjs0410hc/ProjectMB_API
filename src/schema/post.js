const mongoose = require("mongoose");
const {Schema} = mongoose;

const postSchema = new Schema({
  title: {type:String,required:true,unique:true},
  content: {type:String, required:true},
  category: {type:mongoose.Types.ObjectId,required:true,ref:"Category"},
  author: {type: mongoose.Types.ObjectId,required:true,ref:"User"},
  files: [{type:mongoose.Types.ObjectId,ref:"Filemgmt"}],
  createdAt: Date,
  editedAt: {type:Date, default:Date.now},
  isEdited: {type:Boolean, default:false},
  comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}],
  isDeleted: {type:Boolean,default:false},
  deletedAt: {type:Date},
  isPrivate: {type:Boolean,default:false}
},{timestamps:true});

module.exports = {PostModel:mongoose.model("Post",postSchema)};