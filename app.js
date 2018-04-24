
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

var passport = require('passport');
var flash    = require('connect-flash');
var connection  = require('express-myconnection');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

global.websiteurl = "https://sesm.herokuapp.com";

require('./config/passport')(passport); // pass passport for configuration

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

app.use(express.methodOverride());
app.use(cookieParser());

/*------------------------------------------
 connection peer, register as middleware
 type koneksi : single,pool and request
 -------------------------------------------*/

//app.use(
//    connection(mysql,{
//        host: '127.0.0.1', //'localhost',
//        user: 'root',
//        password : 'password',
//        port : 3000, //port mysql
//        database:'ses'
//    },'pool') //or single
//);

app.use(
    connection(mysql,{
        host: 'sql12.freesqldatabase.com', //'localhost',
        user: 'sql12234386',
        password : 'alpM4ypvLJ',
        port : 3306, //port mysql
        database:'sql12234386'
    },'pool') //or single
);

// required for passport
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

global.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sesm.sys@gmail.com',
        pass: 'Aq123456'
    }
});


// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//app.use(app.router);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
