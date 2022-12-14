var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const config = require("./config/globals");

const passport = require("passport")
const basicStrategy = require('passport-http').BasicStrategy;

var indexRouter = require('./routes/index');
let userRouter = require("./routes/API/user/user");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
passport.use(new basicStrategy((username, password, done) => {
    if (username == "loggedInUser" && password == "theirPassword") {
        console.log("authenticated");
        return done(null, username);
    } else {
        console.log("not authenticated");
        return done(null, false);
    }
}));



app.use('/', indexRouter);
app.use("/api/user", passport.authenticate('basic', { session: false }), userRouter);


mongoose
    .set('strictQuery', true)
    .connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((message) => {
        console.log("connected Successfully");
    })
    .catch((error) => {
        console.log(`Error while connecting to db! ${error}`);
    });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;