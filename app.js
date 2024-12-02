var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
  const allowedRoles = ["user", "content-creator"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).send("Invalid role");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const request = new sql.Request();

  try {
    await request.query(
      `INSERT INTO Users (username, password, role) VALUES ('${username}', '${hashedPassword}', '${role}')`
    );
    res.send("Signup successful");
    console.log(`User ${username} signed up with role ${role}`);
  } catch (err) {
    res.status(500).send("Error signing up");
    console.error("Error signing up:", err);
  }
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
