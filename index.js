const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const io = new Server(http, {
  cors: {
    origin: ["https://corsted.xyz", "https://www.corsted.xyz", "https://corsted.cherryblood.repl.co"]
  }
});

const cors = require('cors');
const mongoose = require('mongoose');
const { registerValidation, loginValidation, postCreateValidation } = require('./validations.js');
const { handleValidationErrors, checkAuth } = require('./utils/index.js');
const { UserController, PostController, MessageController } = require('./controllers/index.js');
const UserModel = require('./models/User.js');
mongoose
  .connect(process.env.mongodb)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));



const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/messages/:id', checkAuth, MessageController.getAll);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

http.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Сервер запущен успешно');
});

const MessageModel = require('./models/Message.js');

io.on('connection', (socket) => {
  socket.on('joinRoom', async (data) => {
    try { 
      const decoded = jwt.verify(data.token, process.env.secret);

    socket.user = decoded.id;
    } catch (err) {
      console.log("erorr", err)
    }
    socket.join(data.id);
  });
  socket.on('new message', async (msg) => {
   const user = await UserModel.findOne({ id: socket.user });
    const messageData = { serverid: msg.serverid, message: { content: msg.content , time: 1 }, user: { username: user.username, id: user.id, avatar: user.avatar} };
    const doc = new MessageModel(messageData);
    await doc.save();

    io.to(msg.serverid).emit('send message', messageData);
  });
});