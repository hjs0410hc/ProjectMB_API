const { HTTPError } = require("../customError");
const { UserModel } = require("../schema/user");
const { ERR_NOTFOUND, ERR_UNAUTH } = require("../strings");
const { bencrypt, bdecrypt } = require("./bcryptService");
const { sign, refresh } = require("./jwtService");

/**
 * DB에 유저 정보를 저장하고 JWT 토큰을 발행한다. 
 * @param {*} req {username,email,password} 
 * @returns token
 */
async function signUp(req){
    const {username, email, password} = req.body;
    const hashedpw = await bencrypt(password);
    const newUser = new UserModel({email:email,username:username,password:hashedpw});
    const result = await newUser.save();
    const token = sign({_id:result._id,email:result.email,username:result.username});
    const refToken = await refresh(result._id);
    return [token,refToken];
}

/**
 * DB에서 username 또는 email로 query하여 정보를 확인한다.
 * @param {*} req {username, email, password}
 * @returns token
 */
async function signIn(req){
    const {username, email, password} = req.body;
    const findUser = await UserModel.findOne({$or:[{username:username},{email:email}]});
    if(!findUser){
        throw new HTTPError(404,ERR_NOTFOUND+": User");
    }
    if(await bdecrypt(password,findUser.password)){
        const token = sign({_id:findUser._id,email:findUser.email,username:findUser.username});
        const refToken = await refresh(findUser._id);
        return [token,refToken];
    }else{
        throw new HTTPError(403,ERR_UNAUTH);
    }
}

module.exports = {signUp,signIn};