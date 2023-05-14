const { HTTPError } = require("../customError");
const { CateModel } = require("../schema/category");
const { PostModel } = require("../schema/post");
const { ERR_NOTFOUND, ERR_FORBIDDEN } = require("../strings");


// 접근 가능한 게시판을 찾고 그 다음 Post 찾기
async function getAllPosts(req){
    var query;
    if(req.user && req.user.isAdmin){
        query = {};
    }else{
        query = {isPrivate:false};
    }
    const cates = await CateModel.find(query);
    var cateids = [];
    cates.forEach(category => {
        cateids.push(category._id);
    });
    if(req.user && req.user.isAdmin){
        query = {category:{$in:cateids}};
    }else{
        query = {$and:[{category:{$in:cateids}},{isPrivate:false}]};
    }
    const posts = await PostModel.find(query).sort({createdAt:-1});
    return posts;
}
async function getOnePost(req){
    const post = await PostModel.findOne({_id:req.params.postid}).populate('category').populate('author');
    if(!post){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    if(post.isPrivate){
        if( (req.user && !req.user.isAdmin ) || (!req.user))
        throw new HTTPError(403,ERR_FORBIDDEN);
    }
    return post;
}

async function createPost(req){
    const {title,content,category,isPrivate} = req.body;
    const fcategory = await CateModel.findOne({title:category});
    if(!fcategory){
        throw new HTTPError(400,ERR_NOTFOUND+": Category");
    }

    const newPost = new PostModel({author:req.user._id,title:title,content:content,category:fcategory._id,isPrivate:isPrivate});
    const result = await newPost.save();
    return result._id;
}
async function updatePost(req){
    const {postid} = req.params;
    const {title,content,category,isPrivate} = req.body;
    var fcategory;
    if(category){
        fcategory = await CateModel.findOne({title:category});
        if(!fcategory){
            throw new HTTPError(400,ERR_NOTFOUND+": Category");
        }
    }
    const post = await PostModel.findOne({_id:postid});
    if(!post){
        throw new HTTPError(404,ERR_NOTFOUND+": Post");
    }
    const result = await post.updateOne({title:title,content:content,
        category:(fcategory && fcategory._id),isPrivate:isPrivate,
        isEdited:true, editedAt:Date.now()});
    
    return result.modifiedCount;
}
async function removePost(req){
    const {postid} = req.params;
    const post = await PostModel.findOne({_id:postid});
    if(!post){
        throw new HTTPError(404,ERR_NOTFOUND+": Post");
    }
    const result = await post.updateOne({isDeleted:true,deletedAt:Date.now()});
    
    return result.modifiedCount;
}
module.exports = {getAllPosts,getOnePost,createPost,updatePost,removePost};