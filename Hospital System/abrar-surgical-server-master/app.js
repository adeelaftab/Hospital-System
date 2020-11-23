var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config.js');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var testCategoryRouter = require('./routes/test-category');
const medicalTestRouter = require('./routes/medical-test');

const chargesCategoryRouter = require('./routes/charges-category');

const chargesRouter = require('./routes/charges');
const dailychargesRouter = require('./routes/daily-charges');
const roomTypeRouter = require('./routes/room-type');
const roomRouter = require('./routes/room');
const specializationRouter = require('./routes/specialization');
const consultantRouter = require('./routes/consultant');
const patientRouter = require('./routes/patient');
const outdoorRouter = require('./routes/outdoor');
const indoorRouter = require('./routes/indoor');
const paymentRouter = require('./routes/payment');
const helperRouter = require('./routes/helper');
const reportRouter = require('./routes/report');
const expenseCategoryRouter = require('./routes/expense-category');
const expenseRouter = require('./routes/expense');
var app = express();


// add mongoose 
var mongoose = require('mongoose');
//mongoose.connect('mongodb://root:A12345@ds259806.mlab.com:59806/hospital', {useNewUrlParser: true});
mongoose.connect(config.mongo, {useNewUrlParser: true});
// add cors 
var cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/test-category',testCategoryRouter);
app.use('/medical-test',medicalTestRouter);

app.use('/expense-category',expenseCategoryRouter);
app.use('/expense',expenseRouter);

app.use('/charges-category',chargesCategoryRouter);
app.use('/charges',chargesRouter);
app.use('/daily-charges',dailychargesRouter);
app.use('/room-type',roomTypeRouter);
app.use('/room',roomRouter);
app.use('/specialization',specializationRouter);
app.use('/consultant',consultantRouter);
app.use('/patient',patientRouter);
app.use('/outdoor',outdoorRouter);
app.use('/indoor',indoorRouter);
app.use('/payment',paymentRouter);
app.use('/helper',helperRouter);
app.use('/report',reportRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
