var createError = require('http-errors');
var express = require('express');
require('express-async-errors');
var logger = require('morgan');
var passport = require('passport');
var expressGraphQL = require('express-graphql');

const schema = require('./src/schema/schema');

var app = express();

app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/graphql',(req,res,next) => {
  if(req.headers['authorization']){
    passport.authenticate('jwt')(req,res,next);
  }else{
    next();
  }
},expressGraphQL({
  graphiql: true,
  schema
}));

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
