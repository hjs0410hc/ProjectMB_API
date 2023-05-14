var express = require('express');
const { getAllUsers, getOneUserByUsernameOrEmail, updateUser, removeUser } = require('../service/userService');
const { authJWTMiddleware } = require('../middleware/authMiddleware');
const { HTTPError } = require('../customError');
const { ERR_MISSINGPARAM } = require('../strings');
const { permCheckMiddleware } = require('../middleware/permMiddleware');
var userRouter = express.Router();


userRouter.get('/',authJWTMiddleware,permCheckMiddleware(),async (req,res)=>{
    try{
        const data = await getAllUsers();
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

userRouter.get('/me',authJWTMiddleware,async (req,res)=>{
    try{
        res.send({data:req.user});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

userRouter.get('/:useremail',async (req,res)=>{
    try{
        const { useremail } = req.params;
        if(!useremail){
            throw new HTTPError(400,ERR_MISSINGPARAM); // 없어도 위로 routing 될 것 같다.
        }
        const data = await getOneUserByUsernameOrEmail(useremail);
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

userRouter.put("/:useremail",authJWTMiddleware,async(req,res)=>{
    try{
        const {useremail} = req.params;
        if(!useremail){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const result = await updateUser(req);
        res.send({data:{modifiedCount:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

userRouter.delete("/:useremail",authJWTMiddleware,async(req,res)=>{ // this actually not deleting
    try{
        const {useremail} = req.params;
        if(!useremail){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const result = await removeUser(req);
        res.send({data:{deletedCount:result}});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
});

module.exports = userRouter;
