var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
// var apolloServer = require('./apollo');

//connect DB
var DB = require('./views/DBConnection');

var app = express();
var indexRouter = require('./routes/index')(app, DB);
var usersRouter = require('./routes/users');

// apollo
// apolloServer.applyMiddleware({ app });

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

app.use(session({
  secret: "node-session",
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: process.env.MYSQL_HOST,
    post: 3306,
    user: 'autoinven',
    password: 'autoin2021',
    database: 'autoinven'
  })
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  console.error(err);
  res.status(err.status || 500);
  res.render('error.pug');
});

module.exports = app;
