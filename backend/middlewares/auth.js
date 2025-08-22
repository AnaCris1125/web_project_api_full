const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    console.log('No token en la petición');
    return res.status(401).send({ message: 'Authorization required' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log('Token válido para usuario:', payload);
    
  } catch (err) {
    console.log('Token inválido');
    return res.status(401).send({ message: 'Invalid token' });
  }

  req.user = payload; 
  next();
};
