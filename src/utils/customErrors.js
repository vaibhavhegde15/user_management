class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  class BadRequestError extends AppError {
    constructor(message) {
      super(message, 400);
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message) {
      super(message, 401);
    }
  }
  
  class ForbiddenError extends AppError {
    constructor(message) {
      super(message, 403);
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message) {
      super(message, 404);
    }
  }
  
  module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
  };
  