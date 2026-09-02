import { errorResponse } from '../utils/response.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  console.error('[UNHANDLED ERROR]:', err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal Server Error' 
    : (err.message || 'Internal Server Error');

  return errorResponse(res, message, statusCode);
};
