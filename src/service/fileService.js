const { HTTPError } = require("../customError");
const { fileModel } = require("../schema/filemgmt");
const { ERR_NOTFOUND, ERR_FORBIDDEN } = require("../strings");

async function getAllFileInfos(){
    const files = await fileModel.find({});
    return files;
}

async function getImageFileInfo(req){
    const fileinfo = await fileModel.findOne({filename:req.params.filename});
    if(!fileinfo){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    if( (!req.user&&fileinfo.isPrivate) || (req.user && !req.user.isAdmin && fileinfo.isPrivate) ){
        throw new HTTPError(403,ERR_FORBIDDEN);
    }
    return fileinfo;
}

async function getFileInfo(req){
    const fileinfo = await fileModel.findOne({filename:req.params.filename});
    if(!fileinfo){
        throw new HTTPError(404,ERR_NOTFOUND);
    }
    if( (!req.user&&fileinfo.isPrivate) || (req.user && !req.user.isAdmin && fileinfo.isPrivate) ){
        throw new HTTPError(403,ERR_FORBIDDEN);
    }
    return fileinfo;
}

async function createFiles(req){ // req.files check
    const fileList = req.files;
    const pathList = [];
    for(var i=0;i<fileList.length;i++){
        const file = fileList[i];
        const newFile = new fileModel({
            filename:file.filename,
            filepath:file.path,
            filesize:file.size,
            isPrivate:false,
            uploadedBy:req.user._id
        })
        const result = await newFile.save();
        pathList.push(result);
    }
    return pathList;
}

module.exports = {getImageFileInfo,getAllFileInfos,createFiles,getFileInfo};