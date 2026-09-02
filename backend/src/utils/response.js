export const successResponse = (res, message = 'Success', data = null, statusCode = 200, extra = {}) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...extra
  };
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  return res.status(statusCode).json(response);
};
