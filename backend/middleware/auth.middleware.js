const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
