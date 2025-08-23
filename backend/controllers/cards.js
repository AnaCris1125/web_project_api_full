const Card = require('../models/card');
const mongoose = require('mongoose');

// GET /cards
module.exports.getCards = (req, res) => {
  Card.find({ owner: req.user._id })
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Error del servidor' }));
};

// POST /cards
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;



  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Datos inválidos' });
      return res.status(500).send({ message: 'Error del servidor' });
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ message: 'Tarjeta eliminada', card }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'ID inválido' });
      if (err.message === 'NotFound') return res.status(404).send({ message: 'Tarjeta no encontrada' });
      return res.status(500).send({ message: 'Error del servidor' });
    });
};

// PUT  /cards/:cardId/likes
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // agrega _id al array si aún no está ahí
  { new: true },
)
.orFail(() => new Error('NotFound'))
.then((card) => res.send(card))
.catch((err) => {
  if (err.name === 'CastError') return res.status(400).send({ message: 'ID inválido' });
  if (err.message === 'NotFound') return res.status(404).send({ message: 'Tarjeta no encontrada' });
  return res.status(500).send({ message: 'Error del servidor' });
});
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } }, // elimina _id del array
  { new: true },
)
.orFail(() => new Error('NotFound'))
.then((card) => res.send(card))
.catch((err) => {
  if (err.name === 'CastError') return res.status(400).send({ message: 'ID inválido' });
  if (err.message === 'NotFound') return res.status(404).send({ message: 'Tarjeta no encontrada' });
  return res.status(500).send({ message: 'Error del servidor' });
});
};


// // GET /cards
// module.exports.getCards = (req, res, next) => {
//   console.log('🟡 Entrando a getCards. Usuario autenticado:', req.user);
//   Card.find({ owner: req.user._id })
//     .populate('likes')
//     .then((cards) => res.send(cards))
//     .catch(next); 
// };

// // POST /cards
// module.exports.createCard = (req, res, next) => {
//   const { name, link } = req.body;

//   Card.create({ name, link, owner: req.user._id })
//     .then((card) => res.status(201).send(card))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         err.statusCode = 400;
//         err.message = 'Datos inválidos';
//       }
//       next(err);
//     });
// };

// // DELETE /cards/:cardId

// module.exports.deleteCard = (req, res, next) => {
//   Card.findByIdAndDelete(req.params.cardId)
//     .orFail(() => {
//       const error = new Error('Tarjeta no encontrada');
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((card) => res.send({ message: 'Tarjeta eliminada', card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         err.statusCode = 400;
//         err.message = 'ID inválido';
//       }
//       next(err);
//     });
// };

// // PUT /cards/:cardId/likes
// module.exports.likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail(() => {
//       const error = new Error('Tarjeta no encontrada');
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         err.statusCode = 400;
//         err.message = 'ID inválido';
//       }
//       next(err);
//     });
// };

// // DELETE /cards/:cardId/likes
// module.exports.dislikeCard = (req, res, next) => {
 
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail(() => {
//       const error = new Error('Tarjeta no encontrada');
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         err.statusCode = 400;
//         err.message = 'ID inválido';
//       }
//       next(err);
//     });
// };