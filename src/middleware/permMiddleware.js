const { HTTPError } = require("../customError");
const { UserModel } = require("../schema/user");
const { ERR_UNAUTH } = require("../strings");


function permCheckMiddleware(){
    return async function(req,res,next){
        // 아래의 두개를 이용하십시오
        /* console.log(req.token);
        console.log(perm); */
        try{
            const me = await UserModel.findOne({_id:req.token.id});
            if(!me.isAdmin){
                throw new HTTPError(403,ERR_UNAUTH);
            }
            next();
        }catch(ex){
            res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
        }
    }
}

module.exports = {permCheckMiddleware};