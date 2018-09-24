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
const GeneralRouter = require('./src/routes/general');
const StudentLessonRouter = require('./src/routes/studentLesson');
const TeacherLessonRouter = require('./src/routes/teacherLesson');
const CustomerRouter = require('./src/routes/customer');
app.use('/', GeneralRouter);
app.use('/student-lesson', StudentLessonRouter);
app.use('/teacher-lesson', TeacherLessonRouter);
app.use('/customer', CustomerRouter);

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
  res.send({errors: err.errors});
});

module.exports = app;
