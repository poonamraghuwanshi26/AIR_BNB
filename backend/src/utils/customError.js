class CustomError extends Error {
    constructor(message, statusCode) {
      super(message); // Call parent (Error) constructor to set the message
      this.statusCode = statusCode; // Custom property for HTTP status code
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError); 
        // Helps keep the stack trace clean (omits constructor internals)
      }
    }
  }
  
  module.exports = CustomError;