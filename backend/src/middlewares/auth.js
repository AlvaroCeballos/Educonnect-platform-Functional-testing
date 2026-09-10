const jwt = require('jsonwebtoken');


  //Verifica JWT en header: Authorization: Bearer <token>
  //Agrega req.user con el payload decodificado
 
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Token de acceso requerido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};


 //Verifica que req.user tenga uno de los roles permitidos
 // Uso: router.get('/ruta', authenticate, authorize('admin'), handler)
 
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role))
    return res.status(403).json({ message: 'No tienes permiso para esta acción' });
  next();
};

// Mocks para el equipo:
// Reemplazar por `authenticate` 
const mockStudent = (req, _res, next) => {
  req.user = { id: 1, role: 'student', email: 'mock@student.com', status: 'APPROVED' };
  next();
};

const mockTutor = (req, _res, next) => {
  req.user = { id: 2, role: 'tutor', email: 'mock@tutor.com', status: 'APPROVED' };
  next();
};

const mockAdmin = (req, _res, next) => {
  req.user = { id: 99, role: 'admin', email: 'admin@educonnect.com', status: 'APPROVED' };
  next();
};

module.exports = { authenticate, authorize, mockStudent, mockTutor, mockAdmin };