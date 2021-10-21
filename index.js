// var bcrypt = require('bcrypt');
 
// // пароль пользователя
// var passwordFromUser = "1234";
 
// // создаем соль
// var salt = bcrypt.genSaltSync(10);
 
// // шифруем пароль
// var passwordToSave = bcrypt.hashSync(passwordFromUser, salt)
 
// // выводим результат
// console.log(salt);
// console.log(passwordFromUser);
// console.log(passwordToSave);
const express = require('express');
const userRouter = require('./routes/user.routes');
const mainRouter = require('./routes/main.routes');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use('/', userRouter);
app.use('/', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
      statusCode: 404,
      errorText: 'Page Not Found'
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
      statusCode: 500,
      message: err.message,
      stack: err.stack
  });
});

app.listen(PORT, ()=> console.log(`server start on port ${PORT}`));