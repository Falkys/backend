const MessageModel = require('../models/Message.js');

const getAll = async (req, res) => {
  try {
    const messages = await MessageModel.find({ serverid: req.params.id });
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить сообщения',
    });
  }
};


const remove = async (req, res) => {
  try {
    const messageID = req.params.id;

    MessageModel.findOneAndDelete(
      {
        id: messageId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить сообщение',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Соообщение не найдено',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить сообщение',
    });
  }
};

const create = async (req, res) => {
  try {
    
    const doc = new MessageModel({
      content: req.body.text,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать сообщение',
    });
  }
};

const update = async (req, res) => {
  try {
    const messageId = req.params.id;

    await MessageModel.updateOne(
      {
        id: messageId,
      },
      {
        content: req.body.content,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

module.exports = { create, remove, getAll, update }