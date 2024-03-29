const { body } = require('express-validator');

const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('username', 'Имя должно содержать минимум 3 символа').isLength({ min: 3 }),
  body('avatar', 'Неверная ссылка на аватарку').optional().isURL(),
];

const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

module.exports = { loginValidation, registerValidation, postCreateValidation }
