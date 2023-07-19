var express = require('express');
var app = express();
var port = 3000;
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require("morgan");
var userRouter = require('./route/user');
var authRouter = require('./route/auth');
const categoryRouter = require('./route/category');
const postRouter = require('./route/post');
const commRouter = require('./route/comment');
const fileRouter = require('./route/file');
const https = require('https');
const fs = require('fs');

app.use(morgan('combined'));
app.use(express.json());
/* app.use(cors({
    origin:"https://blog.thxx.xyz"
})); */
app.use(cors());

app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/category',categoryRouter);
app.use('/post',postRouter);
app.use('/comment',commRouter);
app.use('/files',fileRouter);


/* const options = {
    ca: fs.readFileSync('/etc/letsencrypt/live/thxx.xyz/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/thxx.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/thxx.xyz/cert.pem')
}

https.createServer(options, app).listen(3000,()=>{
    mongoose.connect("####");
    console.log(`API listening on port ${port}`);
}) */

app.listen(3000,()=>{
    mongoose.connect("###");
    console.log(`API listening on port ${port}`);
})