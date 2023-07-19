var jwt = require('jsonwebtoken');
const { ERR_FORBIDDEN, ERR_NOTFOUND } = require('../strings');
const { UserModel } = require('../schema/user');
const JWTKEY = "SECRET!!!!"

/**
 * 
 * @param {*} user {_id, email} 
 * @returns jsonWebToken
 */
function sign(user){
    const payload = {
        id:user._id,
        email:user.email,
        username:user.username
    }
    return jwt.sign(payload,JWTKEY,{expiresIn:'1d'});
}


/**
 * 
 * @param {*} token 
 * @returns object{id,email}
 */
function verify(token){
    let decoded = null;
    try{
        decoded = jwt.verify(token,JWTKEY)
        return {
            id:decoded.id,
            email:decoded.email,
            username:decoded.username
        }
    }catch(err){
        return null;
    }
}

async function refresh(userid){
    const user = await UserModel.findOne({_id:userid});
    const newRefToken = jwt.sign({},JWTKEY,{expiresIn:"7d"});
    await user.updateOne({
        refToken:newRefToken
    })

    return newRefToken;
}

// decode(access_token) 으로 계정 정보를 확인.
// DB에 접속해서 해당 계정의 RefTokenExpiry를 확인.
// RefTokenExpiry가 만료된 경우 실패 Response
// RefTokenExpiry가 만료되지 않은 경우?
// AccessToken 재발급, RefToken 재발급, RefTokenExpiry 재설정
// Signin endpoint에 접속하여 성공적으로 로그인 시 RefToken 재발급, RefTokenExpiry 재설정
// NO-REUSE 메타

async function refreshVerify(req,acctoken){
    const refToken = req.body.refreshToken;
    if(!jwt.verify(refToken,JWTKEY)){
        return null; // reftoken expired
    }
    const acctokenData = jwt.decode(acctoken);
    const user = await UserModel.findOne({username:acctokenData.username});
    if(!user){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    const refTokenFromDB = user.refToken;

    if(refToken !== refTokenFromDB){ // invalid refToken.
        return null;
    }

    const newAccToken = sign(user);
    const newRefToken = await refresh(user._id);
    return [newAccToken,newRefToken];
}

module.exports = {sign,verify,refreshVerify,refresh};