var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var categoryRouter = require('./routes/category');
var contactRouter = require('./routes/contact');
var errorRouter = require('./routes/error');
var postRouter = require('./routes/post');
var post_nosidebarRouter = require('./routes/post_nosidebar');
var regularRouter = require('./routes/regular');

var loginRouter = require('./routes/login');
var loginQueryRouter = require('./routes/loginQuery');

var signupQueryRouter = require('./routes/signupQuery');
var signupRouter = require('./routes/signup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);
app.use('/login', loginRouter);
app.use('/loginQuery', loginQueryRouter);
app.use('/index', indexRouter);
app.use('/signup',signupRouter);
app.use('/signupQuery',signupQueryRouter);
app.use('/signupSuccess',indexRouter);


//Liuxutong add here

app.use('/category', categoryRouter);
app.use('/contact', contactRouter);
app.use('/error', errorRouter);
app.use('/post', postRouter);
app.use('/post_nosidebar', post_nosidebarRouter);
app.use('/regular', regularRouter);

app.use('/user', loginRouter);


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
