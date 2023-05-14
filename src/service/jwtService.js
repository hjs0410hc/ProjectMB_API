var jwt = require('jsonwebtoken');
const JWTKEY = "TESTINGJWTKEY"

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
    return jwt.sign(payload,JWTKEY,{expiresIn:'2d'});
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

function refresh(){
    return jwt.sign({},JWTKEY,{expiresIn:'14d'});
}

async function refreshVerify(token,userId){
    // get refresh token from 'auth' collection. (async)
    // parameter token과 db에서 가져온 refresh token이 같으면
    // try to jwt.verify(token, JWTKEY) and return true
    // catch error : invalid token (corrupted or expired.)
    // return false
}

module.exports = {sign,verify,refreshVerify,refresh};