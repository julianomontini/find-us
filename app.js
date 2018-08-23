var createError = require('http-errors');
var express = require('express');
require('express-async-errors');
var logger = require('morgan');
var passport = require('passport');
var cors = require('cors')

var app = express();

app.use(cors());
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//ROUTES
var AuthRoute = require('./src/routes/auth');
var AulaAluno = require('./src/routes/aula-aluno');
var TagsRoute = require('./src/routes/tags');
var AulaRoute = require('./src/routes/aula');
app.use('/auth', AuthRoute);
app.use('/aula-aluno', AulaAluno);
app.use('/aula', AulaRoute);
app.use('/tags', TagsRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
