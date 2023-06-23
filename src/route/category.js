var express = require('express');
const { authAllowAnonymous, authJWTMiddleware } = require('../middleware/authMiddleware');
const { getAllCategory, createCategory, updateCategory, removeCategory, getOneCategory } = require('../service/categoryService');
const { HTTPError } = require('../customError');
const { ERR_MISSINGPARAM } = require('../strings');
const { permCheckMiddleware } = require('../middleware/permMiddleware');
const { body } = require('express-validator');
const { paramcheckMW } = require('../middleware/paramCheckMW');
var categoryRouter = express.Router();

categoryRouter.get('/',authAllowAnonymous,async (req,res)=>{
    try{
        const data = await getAllCategory(req);
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

categoryRouter.get('/:cattitle',authAllowAnonymous,async (req,res)=>{
    try{
        const {cattitle}=req.params;
        if(!cattitle){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const data = await getOneCategory(req);
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

categoryRouter.post('/',authJWTMiddleware,permCheckMiddleware(),
body(['title','description']).notEmpty(),paramcheckMW,
async (req,res)=>{
    try{
        const result = await createCategory(req);
        res.send({data:{createdId:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

categoryRouter.put('/:cattitle',authJWTMiddleware,permCheckMiddleware(),async(req,res)=>{
    try{
        const {cattitle}= req.params;
        if(!cattitle){
            throw new HTTPError(400, ERR_MISSINGPARAM);
        }
        const result = await updateCategory(req);
        res.send({data:{modifiedCount:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

categoryRouter.delete('/:cattitle',authJWTMiddleware,permCheckMiddleware(),async(req,res)=>{
    try{
        const {cattitle}= req.params;
        if(!cattitle){
            throw new HTTPError(400, ERR_MISSINGPARAM);
        }
        const result = await removeCategory(req);
        res.send({data:{deletedCount:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});
module.exports = categoryRouter;