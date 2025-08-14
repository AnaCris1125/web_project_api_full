require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { errors: celebrateErrors } = require('celebrate');
const expressWinston = require('express-winston');
const winston = require('winston');

const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3000, MONGODB_URI } = process.env;

// Configuración CORS
const corsOptions = {
  origin: 'https://around.ana.chickenkiller.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Logger de solicitudes
app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'logs/request.log') }),
  ],
  format: winston.format.json(),
}));

// Rutas públicas
app.post('/signup', createUser);
app.post('/signin', login);

// Middleware de autorización para rutas privadas
app.use(auth);

// Rutas privadas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Manejo de errores de celebrate
app.use(celebrateErrors());

// Logger de errores
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'logs/error.log') }),
  ],
  format: winston.format.json(),
}));

// Manejo centralizado de errores
app.use(errorHandler);

// Conexión a MongoDB y arranque del servidor
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });

module.exports = app;