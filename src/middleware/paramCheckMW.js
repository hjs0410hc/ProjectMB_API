const { validationResult } = require("express-validator");
const { ERR_MISSINGPARAM } = require("../strings");

function paramcheckMW(req,res,next){
    const result = validationResult(req).formatWith(error=>({path:error.path,msg:error.msg,nestedErrors:error.nestedErrors}));
    if(!result.isEmpty()){
        res.status(400).send({error:{message:ERR_MISSINGPARAM,parameters:result.array()}});
    }else{
        next();
    }
}

module.exports = {paramcheckMW};