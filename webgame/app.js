var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var mysql = require('mysql')


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bl00p',
  database: 'tester'
})

// connection.connect(function(err) {
// if (err) throw err
//     console.log('Connection established')
// })

// connection.query('SELECT * FROM game_stats2 WHERE game_id = 1.0 AND net_id = "jll2219"',function(err,rows){
//     if(err) throw err;
//     console.log('Data received from Db:\n');
//     console.log(rows);
// })


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.get('/', function (req, res) {
  res.render(index);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


module.exports = app;











