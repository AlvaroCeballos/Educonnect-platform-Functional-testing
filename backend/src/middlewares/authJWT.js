const jwt = require('jsonwebtoken');

// validar JWT en rutas protegidas
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.substring(7); // Quita "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error('Error validando JWT:', err.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// verificar que el usuario autenticado tenga rol admin
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol admin' });
  
  next();
};

module.exports = { authenticateJWT, authorizeAdmin };