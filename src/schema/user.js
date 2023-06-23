const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    username:{type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    description: {type:String},
    password:{type:String,required:true},
    avatar: String,
    isAdmin: {type:Boolean,default:false},
    deletedAt: {type:Date},
    isDeleted: {type:Boolean,default:false},
    isPrivate:{type:Boolean,default:false},
    refToken: String
},{timestamps:true});

module.exports = {UserModel:mongoose.model("User",userSchema)};