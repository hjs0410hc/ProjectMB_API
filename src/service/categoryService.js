const { HTTPError } = require("../customError");
const { CateModel } = require("../schema/category");
const { PostModel } = require("../schema/post");
const { ERR_NOTFOUND, ERR_FORBIDDEN } = require("../strings");


/**
 * 
 * 이건 Private인 카테고리를 줘서는 안된다.
 * 
 * 
 * @param {*} req  (req.user CHECK)
 */
async function getAllCategory(req){
    var query;
    if(req.user && req.user.isAdmin){
        query = {};
    }else{
        query = {isPrivate:false};
    }
    const cates = await CateModel.find(query);
    return cates;
}

async function getOneCategory(req){
    const {cattitle}=req.params;
    const category = await CateModel.find({title:cattitle});
    if(!category){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    if((!req.user && category.isPrivate) || (req.user && !req.user.isAdmin && category.isPrivate)){
        throw new HTTPError(403,ERR_FORBIDDEN);
    }
    var query; // Private post filtering

    if((!req.user) || (req.user && !req.user.isAdmin)){
        query = {$and:[{category:category._id},{isPrivate:false}]}
    }else{
        query  = {category:category._id};
    }
    const posts = await PostModel.find(query).populate('author');
    return {category:category,posts:posts};
}

async function createCategory(req){
    const {title,description,isPrivate} = req.body;
    const newCate = new CateModel({title:title,description:description,isPrivate:isPrivate});
    const result = await newCate.save();
    return result._id;
}

async function updateCategory(req){
    const {cattitle}= req.params;
    const {title,description,isPrivate} = req.body;
    const category = await CateModel.find({title:cattitle});
    if(!category){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    const result = await category.updateOne({title:title,description:description,isPrivate:isPrivate});
    return result.modifiedCount;
}


async function updateCategory(req){
    const {cattitle}= req.params;
    const {title,description,isPrivate} = req.body;
    const category = await CateModel.find({title:cattitle});
    if(!category){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    const result = await category.updateOne({title:title,description:description,isPrivate:isPrivate});
    return result.modifiedCount;
}

async function removeCategory(req){
    const {cattitle}= req.params;
    const category = await CateModel.find({title:cattitle});
    if(!category){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    const result = await category.updateOne({isDeleted:true,deletedAt:Date.now()});
    return result.modifiedCount;
}

module.exports = {getAllCategory,getOneCategory,createCategory, updateCategory, removeCategory};