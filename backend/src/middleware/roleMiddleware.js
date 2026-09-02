import { errorResponse } from '../utils/response.js';

export const requireRole = (allowedRoles) => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Access denied. Unauthenticated request.', 401);
    }

    const hasRole = rolesArray.includes(req.user.role);
    if (!hasRole) {
      return errorResponse(
        res,
        `Access denied. Requires one of the following roles: [${rolesArray.join(', ')}].`,
        403
      );
    }

    next();
  };
};
