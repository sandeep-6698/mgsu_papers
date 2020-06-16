const express = require('express');
const session = require('express-session');
const flash = require('express-flash-messages');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
//const socket = require('socket.io');
require('dotenv').config();

const home = require('./routes/home');
const department = require('./routes/department');
const user = require('./routes/user');
const upload = require('./routes/upload');
const download = require('./routes/download');

const app = express();
const port = process.env.PORT || 3000;
var server = app.listen(port, () => { console.log(`Server started at port:${port}`) });

// const io = socket(server);
// io.on("connection",(socket)=>{
// console.log(socket.id);
// })
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(session({ secret: "sandeep", resave: false, saveUninitialized: false }));
app.use(express.static('node_modules'));
app.use(express.static('config'));
app.use(express.static('public'));

//mongoose
var db = process.env.DB || "mgsu";
var host = process.env.HOST || "localhost";
var dbport = process.env.DBPORT || 27017;
var alterDB = `mongodb://${host}:${dbport}/${db}`;
var cloudDB = process.env.CLOUDDB;
var con = mongoose.connect(cloudDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.error.bind(console, 'connection error'));

//set session varibale to local varivbale
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

//routes
app.use('/', home);
app.use('/department', department);
app.use('/user', user);
app.use('/upload', upload);
app.use('/download', download);

