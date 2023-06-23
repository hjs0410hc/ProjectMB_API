var express = require('express');
const { authAllowAnonymous, authJWTMiddleware } = require('../middleware/authMiddleware');
const { getAllPosts, createPost, updatePost, getOnePost, removePost } = require('../service/postService');
const { ERR_MISSINGPARAM } = require('../strings');
const { permCheckMiddleware } = require('../middleware/permMiddleware');
const { HTTPError } = require('../customError');
const { body, validationResult } = require('express-validator');
const { paramcheckMW } = require('../middleware/paramCheckMW');
var postRouter = express.Router();
postRouter.get('/',authAllowAnonymous,async (req,res)=>{
    try{
        const [posts,counts] = await getAllPosts(req);
        res.send({data:posts,count:counts});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})
postRouter.get('/:postid',authAllowAnonymous,async (req,res)=>{
    try{
        if(!req.params.postid){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const data = await getOnePost(req);
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})
postRouter.post('/',authJWTMiddleware,permCheckMiddleware(),
body(['title','content','category']).notEmpty(),
paramcheckMW,
async (req,res)=>{
    try{
        const data = await createPost(req);
        res.send({data:{createdID:data}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})
postRouter.put('/:postid',authJWTMiddleware,permCheckMiddleware(),async (req,res)=>{
    try{
        if(!req.params.postid){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const result = await updatePost(req);
        res.send({data:{modifiedCount:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});
postRouter.delete('/:postid',authJWTMiddleware,permCheckMiddleware(),async(req,res)=>{
    try{
        if(!req.params.postid){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const result = await removePost(req);
        res.send({data:{deletedCount:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

module.exports = postRouter;