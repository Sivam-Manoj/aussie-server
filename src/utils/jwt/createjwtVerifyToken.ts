import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const createJwtVerifyToken = (userId: string, email: string): string => {
  // Create a JWT with a short expiration time (e.g., 15 minutes)
  const payload = { userId, email };
  const options = { expiresIn: '15m' as jwt.SignOptions['expiresIn'] }; // Ensure correct type for 'expiresIn'
  return jwt.sign(payload, JWT_SECRET, options);
};
