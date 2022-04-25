var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Router = require('./routes/index')
var Connect = require('./connect/connect')
var dotenv = require('dotenv')



dotenv.config()

var app = express();
const PORT = process.env.PORT || 5000;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
Router(app)

Connect()

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;