const mongoose = require("mongoose");
const {Schema} = mongoose;

const catSchema = new Schema({
  title: {type:String,required:true,unique:true},
  description: {type:String, required:true},
  avatar: String,
  isPrivate: {type:Boolean,default:false},
  isDeleted: {type:Boolean,default:false},
  deletedAt:{type:Date}
},{timestamps:true});

module.exports = {CateModel: mongoose.model("Category",catSchema)};