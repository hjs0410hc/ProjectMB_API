const { UserModel } = require("../schema/user");
var {sign,verify} = require("../service/jwtService");
const { ERR_UNAUTH } = require("../strings");

async function authJWTMiddleware(req,res,next){
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        if(!token){
            throw Error();
        }
        const decoded = verify(token);
        if(!decoded){
            throw Error();
        }
        req.token = decoded;
        req.user = await UserModel.findOne({_id:decoded.id});
        next();
    }catch(err){
        res.status(403).send(ERR_UNAUTH);
    }
}
async function authAllowAnonymous(req,res,next){
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        if(!token){
            throw Error();
        }
        const decoded = verify(token);
        if(!decoded){
            throw Error();
        }
        req.token = decoded;
        req.user = await UserModel.findOne({_id:decoded.id});
        next();
    }catch(err){
        req.token = null;
        next();
    }
}

module.exports = {authJWTMiddleware,authAllowAnonymous};