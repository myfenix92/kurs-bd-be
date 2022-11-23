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

const isValidJwt = (header) => {
  const token = header.split(' ')[1];
  if (token) {
    return true;
  } else {
    return false;
  }
};

io.use((socket, next) => {
  const header = socket.handshake.headers['authorization'];
  if (isValidJwt(header)) {
    return next();
  }
  return next(new Error('authentication error'));
});

io.on('connection', (socket) => {
  socket.on('room', room => {
    socket.join(room);
  })

  socket.on('chat message',  (msg, send, id_user) => {

     if (send === 1 ) {
      io.to(`${id_user}`).emit('chat message',  msg, send, id_user);
    } else {
      socket.join(id_user);
      io.to(`${id_user}`).emit('chat message',  msg, send, id_user);
    }
    
  });
});

//app.listen(PORT, ()=> console.log(`server start on port ${PORT}`));
http.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}/`);
});