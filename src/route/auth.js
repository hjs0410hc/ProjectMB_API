var express = require('express');
var authRouter = express.Router();
var {bencrypt,bdecrypt} = require("../service/bcryptService")
var {sign,verify, refreshVerify} = require("../service/jwtService");
var {authJWTMiddleware,authAllowAnonymous} = require("../middleware/authMiddleware");
var {body,validationResult, oneOf}=require('express-validator');
const { signUp, signIn } = require('../service/authService');
const { ERR_MISSINGPARAM, ERR_FORBIDDEN } = require('../strings');
const { HTTPError, HTTPPropertyError } = require('../customError');
const { paramcheckMW } = require('../middleware/paramCheckMW');

/* authRouter.post('/enc',async (req,res)=>{
    var data = {data:await bencrypt(req.body.body)}
    res.send(data);
})
authRouter.post('/dec',async (req,res)=>{
    var data = {data:await bdecrypt(req.body.body,req.body.hash)}
    res.send(data);
})
authRouter.post('/sign',(req,res)=>{
    // get id and email
    var data = {data:sign({_id:req.body.id,email:req.body.email})}
    res.send(data);
})
authRouter.post('/verify',(req,res)=>{
    // get token
    var data = {data:verify(req.body.token)}
    res.send(data);
})
authRouter.get('/gmt',authJWTMiddleware,(req,res)=>{
    res.send({yourinformation:req.token});
})
authRouter.get('/anony',authAllowAnonymous,(req,res)=>{
    if(req.token){
        res.send({yourinformation:req.token});
    }else{
        res.send({yourinformation:"shit"});
    }
}) */


//validator: body1 (req) body2 (req) body3 (nonreq) body4 (nonreq)
/* authRouter.post('/vali',body(['body1','body2']).notEmpty(),(req,res)=>{
    const result = validationResult(req);
    if(result.isEmpty()){
        res.send(req.body);
    }else{
        res.send({data:"you are a pile of shit"});
    }
}) */

authRouter.post('/signup',
body(['username','email','password']).notEmpty(),body('email').isEmail(),paramcheckMW,
async (req,res)=>{
    try{
        const [resultToken,refreshToken] = await signUp(req);
        res.header('Cache-control','no-cache');
        res.send({data:{token:resultToken,refreshToken:refreshToken}});
    }
    catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
     }
});

authRouter.post('/signin',
oneOf([body('username').notEmpty(),body('email').notEmpty().isEmail()]),
body('password').notEmpty(),paramcheckMW,
async (req,res)=>{
    try{
        const [resultToken,refreshToken] = await signIn(req);
        res.header('Cache-control','no-cache');
        res.send({data:{token:resultToken,refreshToken:refreshToken}});
    }catch(ex){
        console.log(ex);
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

authRouter.post('/refresh',body('refreshToken').notEmpty(),paramcheckMW,async (req,res)=>{
    try{
        const acctoken=req.header('Authorization').replace('Bearer ','');
        if(!acctoken){
            throw new HTTPError(400,ERR_MISSINGPARAM); // missing acctoken header
        }
        const result = await refreshVerify(req,acctoken);
        if(!result){
            throw new HTTPError(403,ERR_FORBIDDEN);
        }
        const [accessToken,refreshToken] = result;
        res.send({data:{token:accessToken,refreshToken:refreshToken}});
    }catch(ex){
        console.log(ex);
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

module.exports = authRouter;
