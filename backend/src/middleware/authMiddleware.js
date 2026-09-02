import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { errorResponse } from '../utils/response.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No authentication token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'speedx_motors_luxury_hypercar_jwt_super_secret_key_2026_!@#';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return errorResponse(res, 'Authentication token has expired. Please login again.', 401);
      }
      return errorResponse(res, 'Invalid authentication token.', 401);
    }

    // Verify user exists and is active in database
    const userRes = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.status, u.avatar, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (userRes.rows.length === 0) {
      return errorResponse(res, 'User account associated with token not found.', 401);
    }

    const user = userRes.rows[0];
    if (user.status !== 'ACTIVE') {
      return errorResponse(res, 'User account is not active.', 403);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role_name,
    };

    next();
  } catch (err) {
    console.error('[AUTH MIDDLEWARE ERROR]:', err);
    return errorResponse(res, 'Authentication error.', 500);
  }
};
