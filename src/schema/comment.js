const mongoose = require("mongoose");
const {Schema} = mongoose;

const commSchema = new Schema({
    author: {type:mongoose.Types.ObjectId,ref:"User"
,required:true
},
    parType: {type:Boolean,required:true},
    parPost: {type:mongoose.Types.ObjectId,required:true,ref:"Post"},
    parComm: {type:mongoose.Types.ObjectId,ref:"Comment"},
    createdAt: Date,
    editedAt: {type:Date, default:Date.now},
    isEdited: {type:Boolean,default:false},
    content:{type:String,required:true},
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}],
    /* anonymous:{
        nickname:String,
        password:String,
        ipaddr:String,
        _id:false
    }, */
    isPrivate:{type:Boolean,default:false}

},{timestamps:true});

module.exports = {CommModel:mongoose.model("Comment",commSchema)};