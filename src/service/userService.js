const { HTTPError } = require("../customError");
const { UserModel } = require("../schema/user");
const { ERR_NOTFOUND, ERR_FORBIDDEN } = require("../strings");
const { bencrypt } = require("./bcryptService");

/**
 * 
 * @returns ALL USER Lists
 */
async function getAllUsers(){
    const users = await UserModel.find({});
    return users;
}

async function getOneUserByUsernameOrEmail(ue){
    const user = await UserModel.findOne({$or:[{username:ue},{email:ue}]});
    if(!user){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    return user;
}

async function getOneUserById(id){
    const user = await UserModel.findOne({_id:id});
    if(!user){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    return user;
}

async function updateUser(req){
    const {useremail}=req.params;
    const {username,email,description,password,avatar,isAdmin} = req.body;
    const user = await UserModel.findOne({$or:[{username:useremail},{email:useremail}]});
    if(!user)throw new HTTPError(404,ERR_NOTFOUND);
    if(!req.user.isAdmin && (user._id != req.user._id)){
        throw new HTTPError(403, ERR_FORBIDDEN);
    }
    const result = await user.updateOne({
        description:description,
        username:username,
        email:email,
        password: (password && await bencrypt(password)),
        avatar:avatar,
        isAdmin:isAdmin
    });
    return result.modifiedCount;
}


/**
 * 
 * 고민할 것: 이 유저를 지웠을 때 post와 comment를 전부 지우는가?
 * temp ans : 아니다. deleteAt을 참조하도록 하자
 * 나중에 populate 할 때가 문제다.
 * 
 * @param {*} req
 * @returns result(modifiedCount)
 */
async function removeUser(req){
    const {useremail} = req.params;
    const user = await UserModel.findOne({$or:[{username:useremail},{email:useremail}]});
    if(!user)throw new HTTPError(404,ERR_NOTFOUND);
    if(!req.user.isAdmin && (user._id != req.user._id)){
        throw new HTTPError(403, ERR_FORBIDDEN);
    }
    const result = await user.updateOne({isDeleted:true,deletedAt:Date.now()})
    return result.modifiedCount;
}


module.exports = {getAllUsers,getOneUserByUsernameOrEmail,updateUser,removeUser};