const mongoose = require("mongoose");
const { authorSelect } = require("../selects");
const {Schema} = mongoose;

const commSchema = new Schema({
    author: {type:mongoose.Types.ObjectId,ref:"User"
    ,required:true,autopopulate:{select:authorSelect}
},
    parType: {type:Boolean,required:true},
    parPost: {type:mongoose.Types.ObjectId,required:true,ref:"Post"},
    parComm: {type:mongoose.Types.ObjectId,ref:"Comment"},
    createdAt: Date,
    editedAt: {type:Date, default:Date.now},
    isEdited: {type:Boolean,default:false},
    isDeleted: {type:Boolean,default:false},
    content:{type:String,required:true},
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment",autopopulate:true}],
    /* anonymous:{
        nickname:String,
        password:String,
        ipaddr:String,
        _id:false
    }, */
    isPrivate:{type:Boolean,default:false}

},{timestamps:true});

commSchema.plugin(require('mongoose-autopopulate'));


module.exports = {CommModel:mongoose.model("Comment",commSchema)};