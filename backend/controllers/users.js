const User = require('../models/user');
const bcrypt = require('bcryptjs');

// // GET /users
// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch(() => res.status(500).send({ message: 'Error del servidor' }));
// };

// // GET /users/:userId
// module.exports.getUserById = (req, res) => {
//   User.findById(req.params.userId)
//     .orFail(() => new Error('NotFound'))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'CastError') return res.status(400).send({ message: 'ID inválido' });
//       if (err.message === 'NotFound') return res.status(404).send({ message: 'Usuario no encontrado' });
//       return res.status(500).send({ message: 'Error del servidor' });
//     });
// };

const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'dev-secret' } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  let userRecord;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Correo o contraseña incorrectos');
      }
      userRecord = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Correo o contraseña incorrectos');
      }
      const token = jwt.sign(
        { _id: userRecord._id },
        JWT_SECRET,
        { expiresIn: '7d' },  
      );
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

// // PATCH /users/me
// module.exports.updateProfile = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, about },
//     { new: true, runValidators: true }
//   )
//     .orFail(() => new Error('NotFound'))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') return res.status(400).send({ message: 'Datos inválidos' });
//       if (err.message === 'NotFound') return res.status(404).send({ message: 'Usuario no encontrado' });
//       return res.status(500).send({ message: 'Error del servidor' });
//     });
// };

// // PATCH /users/me/avatar
// module.exports.updateAvatar = (req, res) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { avatar },
//     { new: true, runValidators: true }
//   )
//     .orFail(() => new Error('NotFound'))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') return res.status(400).send({ message: 'URL de avatar inválida' });
//       if (err.message === 'NotFound') return res.status(404).send({ message: 'Usuario no encontrado' });
//       return res.status(500).send({ message: 'Error del servidor' });
//     });
// };