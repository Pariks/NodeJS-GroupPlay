var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketIo = require('socket.io');


var index = require('./routes/index');
var users = require('./routes/users');

const app = express();

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

// Middleware by p_pandya
app.use(function(req, res, next) {
  console.log("In Middleware 1");
  next();
  console.log("out of Middleware 1");
});

// Middleware by p_pandya
app.use(function(req, res, next) {
  console.log("--------In Middleware 2");
  next();
  console.log("out of Middleware 2");
});
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


const server = new http.Server(app);
const io = socketIo(server);
server.listen(8080, "127.0.0.1"); //very much important when using with express + socket.io

io.on("connection", socket => {
    console.log('Client connected');
    socket.on("chat:add", data => {
      console.log(data);
      io.emit("chat:added", data);
    });

  /*  socket.on("disconnect", ()  => {
      console.log("Socket Disconnected");
    });*/
});


module.exports = app;
