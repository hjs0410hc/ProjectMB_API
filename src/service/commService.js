const { HTTPError } = require("../customError");
const { CommModel } = require("../schema/comment");
const { PostModel } = require("../schema/post");
const { ERR_MISSINGPARAM, ERR_NOTFOUND, ERR_FORBIDDEN } = require("../strings");

async function getAllComments(req){
    var query = {};
    if(!req.user || (req.user && !req.user.isAdmin)){
        query ={isPrivate:false}
    }
    const comms = await CommModel.find(query);
    return comms;
}

async function createComment(req){
    const {parType,parPost,parComm,content,isPrivate} = req.body;
    if(parType == '1' && !parComm){
        throw new HTTPError(400,ERR_MISSINGPARAM);
    }
    const post = await PostModel.findOne({_id:parPost});
    var parcomm;
    if(parComm)parcomm = await CommModel.findOne({_id:parComm});
    if(!post){
        throw new HTTPError(404,ERR_NOTFOUND+": parent post");
    }
    if(parComm && !parcomm){
        throw new HTTPError(404,ERR_NOTFOUND+": parent comment");
    }
    const newComm = new CommModel({
        author:req.user._id,
        parType:parType,
        parPost:parPost,
        parComm:parComm,
        content:content,
        isPrivate:isPrivate
    });
    const result = await newComm.save();
    await post.updateOne({$push:{comments:result._id}});
    if(parcomm){
        await parcomm.updateOne({$push:{comments:result._id}});
    }
    return result._id;
}

async function updateComment(req){
    const {commid} = req.params;
    const {content,isPrivate} = req.body;
    const comm = await CommModel.findOne({_id:commid});
    if(!comm){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    if(comm.author != req.user._id){
        throw new HTTPError(403,ERR_FORBIDDEN);
    }
    const result = await comm.updateOne({
        content:content,
        isPrivate:isPrivate,
        editedAt:Date.now(),
        isEdited:true
    });
    return result.modifiedCount;
}


async function removeComment(req){
    const {commid} = req.params;
    const comm = await CommModel.findOne({_id:commid});
    if(!comm){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    if(comm.author != req.user._id){
        throw new HTTPError(403,ERR_FORBIDDEN);
    }
    const result = await comm.updateOne({
        isDeleted:true,
        deletedAt:Date.now()
    });
    return result.modifiedCount;
}

module.exports = {getAllComments,createComment,updateComment,removeComment};