import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = '1h';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    } catch (error) {
      logger.error('Error signing JWT:', error);
      throw new Error('Failed to sign JWT', { cause: error });
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Error verifying JWT:', error);
      throw new Error('Failed to verify JWT', { cause: error });
    }
  },
};
