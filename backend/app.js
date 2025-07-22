const express = require('express');
const mongoose = require('mongoose');

const { login, createUser } = require('./controllers/users');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth); 

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

const app = express();
const PORT = 3000;

// conectar con el servidor MongoDB
mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware para parsear JSON
app.use(express.json());



// Importar routers desde la carpeta routes
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// Usar los routers
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Ruta para cualquier otra cosa — Error 404
app.use((req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
