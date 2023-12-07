const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User.js');
const LastId = require('../models/lastid.js');

const register = async (req, res) => {
  try {
    const emailvalid = await UserModel.findOne({ email: req.body.email });
    if (emailvalid) return res.status(599).json({ message: 'Почта уже зарегестрирована' });
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const lastIdRecord = await LastId.findOne({ name: 'user' });

    if (!lastIdRecord) {
      await LastId.create({ name: 'user', lastId: 10000000000 });
    }
    lastIdRecord.lastId++;
    await lastIdRecord.save();
    const generateid = lastIdRecord.lastId;

    const doc = new UserModel({
      email: req.body.email,
      username: req.body.username,
      avatar: req.body.avatar,
      passwordHash: hash,
      id: generateid,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.secret,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

 const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.secret,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

 const getMe = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.userId });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

module.exports = { getMe, login, register }