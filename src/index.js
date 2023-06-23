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

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/category',categoryRouter);
app.use('/post',postRouter);
app.use('/comment',commRouter);
app.use('/files',fileRouter);


app.listen(port, () => {
    mongoose.connect("mongodb+srv://thxxxyz:sgvkz2QAUSFsZ4WF@thxx.pmgzdhh.mongodb.net/test4?retryWrites=true&w=majority");
    console.log(`Example app listening on port ${port}`);
});