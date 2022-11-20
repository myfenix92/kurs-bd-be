const express = require('express');
const userRouter = require('./routes/user.routes');
const mainRouter = require('./routes/main.routes');
const tableRouter = require('./routes/table.routes');
const cors = require('cors')
const PORT = process.env.PORT || 8080;
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http, {  cors: {
  origin: "http://localhost:5500",
  methods: ["GET", "POST"],
  transports: ['websocket', 'polling'],
  credentials: true
}, allowEIO3: true});


app.use(express.json());

app.use(cors())
app.options('*', cors())
app.use('/', userRouter);
app.use('/', mainRouter);
app.use('/', tableRouter);



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

io.on('connection', (socket) => {
  socket.on('chat message',  (msg, send) => {
    io.emit('chat message',  msg, send);
  //  console.log(msg)
  });
});

//app.listen(PORT, ()=> console.log(`server start on port ${PORT}`));
http.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
});