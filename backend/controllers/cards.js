const Card = require('../models/card');
const mongoose = require('mongoose');

// GET /cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('likes')
    .then((cards) => res.send(cards))
    .catch(next); 
};

// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = 'Datos inválidos';
      }
      next(err);
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ message: 'Tarjeta eliminada', card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'ID inválido';
      }
      next(err);
    });
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'ID inválido';
      }
      next(err);
    });
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
 
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'ID inválido';
      }
      next(err);
    });
};