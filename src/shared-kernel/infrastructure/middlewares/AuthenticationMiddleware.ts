import { UNAUTHORIZED } from 'http-status';
import jwt from 'jsonwebtoken';
import Env from '../../../../config/Env';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const parts = authHeader.trim().split(' ');
    const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
    if (!token) {
      next({ msg: 'Access denied. No token provided.', statusCode: UNAUTHORIZED });
    }

    req.decodedToken = jwt.verify(token, Env.SECRET);

    if (!req.decodedToken) {
      next({ msg: 'Token error.', statusCode: UNAUTHORIZED });
    } else {
      next();
    }
  } catch (err) {
    next({ msg: 'Invalid token.', statusCode: UNAUTHORIZED });
  }
};
