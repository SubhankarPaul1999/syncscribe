const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

module.exports = (req, res, next) => {
  // Get token from either cookies or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    // Make sure decoded payload has userId
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    req.userId = decoded.userId; // Attach to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};