import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     Authorization:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: |
 *         JWT token for authentication. Provide the token directly without any prefix.
 *         Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 *         You can get a token from the /login endpoint.
 */

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