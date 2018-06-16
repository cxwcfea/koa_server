module.exports = class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status || 500;
    this.code = code || 'internal:unknown_error';
  }
};
