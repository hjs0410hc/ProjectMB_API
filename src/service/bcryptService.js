var bcrypt = require('bcrypt');

async function bencrypt(data){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(data,salt);
}

async function bdecrypt(data,hash){
    return await bcrypt.compare(data,hash);
}

module.exports = {bencrypt,bdecrypt};