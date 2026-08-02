import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// The imports above are supplied so students can use jwt and config.jwtSecret.
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).json({error: 'Unauthorized: Missing or malformed token.'});
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.'})
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)){
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.'})
    }
    return next();
  };
}

void jwt;
void config;
