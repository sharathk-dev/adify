import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    
    const token = req.header('Authorization');
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }
  const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.member = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired.' });
      }
    return res.status(401).json({ message: 'Invalid token or token has expired.', error: error.message });
  }
};