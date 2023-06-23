var express = require('express');
const { getAllFileInfos, createFiles, getImageFileInfo, getFileInfo } = require('../service/fileService');
const { authJWTMiddleware, authAllowAnonymous } = require('../middleware/authMiddleware');
const { permCheckMiddleware } = require('../middleware/permMiddleware');
const { imageUploader, fileUploader } = require('../fileupload');
const { HTTPError } = require('../customError');
const { ERR_MISSINGPARAM } = require('../strings');
var fileRouter = express.Router();

fileRouter.get('/',authJWTMiddleware,permCheckMiddleware(),async (req,res)=>{
    try{
        const data = await getAllFileInfos();
        res.send({data:data});
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})


fileRouter.get('/:filename',authAllowAnonymous,async (req,res)=>{
    try{
        if(!req.params.filename){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const fileinfo = await getFileInfo(req);
        res.download(fileinfo.filepath.replace('\\','/'));
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

fileRouter.get('/images/:filename',authAllowAnonymous,async (req,res)=>{
    try{
        if(!req.params.filename){
            throw new HTTPError(400,ERR_MISSINGPARAM);
        }
        const fileinfo = await getImageFileInfo(req);
        res.contentType('image/*').download(fileinfo.filepath.replace('\\','/'));
    }catch(ex){
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

fileRouter.post('/images',authJWTMiddleware,permCheckMiddleware(),imageUploader.array('image'),async (req,res)=>{
    // getting image data request...
    try{
        const result = await createFiles(req);
        res.send({data:result});
    }catch(ex){
        console.log(ex);
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})

fileRouter.post('/',authJWTMiddleware,permCheckMiddleware(),fileUploader.array('file'),async (req,res)=>{
    // getting image data request...
    try{
        const result = await createFiles(req);
        res.send({data:result});
    }catch(ex){
        console.log(ex);
        res.status(ex.code<512?ex.code:500).send({error:{message:ex.message}});
    }
})


module.exports = fileRouter;
