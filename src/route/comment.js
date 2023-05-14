var express = require('express');
const { authAllowAnonymous, authJWTMiddleware } = require('../middleware/authMiddleware');
const { createComment, getAllComments, updateComment, removeComment } = require('../service/commService');
const { body } = require('express-validator');
const { paramcheckMW } = require('../middleware/paramCheckMW');
const { ERR_MISSINGPARAM } = require('../strings');
var commRouter = express.Router();

commRouter.get('/',authAllowAnonymous,async (req,res)=>{
    try{
        const data = await getAllComments(req);
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

commRouter.post('/',authJWTMiddleware,
body(['parType','parPost',]).notEmpty(),
paramcheckMW,
async (req,res)=>{
    try{
        const data = await createComment(req);
        res.send({createdID:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});
commRouter.put('/:commid',authJWTMiddleware,
async (req,res)=>{
    try{
        if(!req.params.commid)throw new HTTPError(400,ERR_MISSINGPARAM);
        const data = await updateComment(req);
        res.send({modifiedCount:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

commRouter.delete('/:commid',authJWTMiddleware,async (req,res)=>{
    try{
        if(!req.params.commid)throw new HTTPError(400,ERR_MISSINGPARAM);
        const data = await removeComment(req);
        res.send({deletedCount:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})
module.exports = commRouter;
