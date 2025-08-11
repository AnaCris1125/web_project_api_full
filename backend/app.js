require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');

const path = require('path');
const { errors: celebrateErrors } = require('celebrate');
const expressWinston = require('express-winston');
const winston = require('winston');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth'); 


const app = express();


const { PORT = 3000, MONGODB_URI } = process.env;

const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:3000', 'https://around.ana.chickenkiller.com', 'https://ana.api.chickenkiller.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  optionsSuccessStatus: 200
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

// Middleware de autorización
app.use(auth);

// Rutas privadas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Middleware manejo de errores de celebrate
app.use(celebrateErrors());

// Logger de errores
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'logs/error.log') }),
  ],
  format: winston.format.json(),
}));


// Conectar a MongoDB y arrancar servidor
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
  });
})
.catch((err) => {
  process.exit(1); 
});

const errorHandler = require('./middlewares/errorHandler'); 
// Middleware manejo centralizado de errores
app.use(errorHandler);

module.exports = app;