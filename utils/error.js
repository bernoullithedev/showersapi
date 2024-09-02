export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;

  // Optional: log the error for debugging
  console.error(`Error ${status}: ${message}`);

  return error;
};
