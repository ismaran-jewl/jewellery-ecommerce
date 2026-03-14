// src/lib/errorHandler.js
import { captureException, captureMessage } from "@/lib/sentry";

export const handleError = (error, context = {}) => {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
    console.error("Context:", context);
  }

  // Send to Sentry
  captureException(error, context);

  // Return structured error
  return {
    success: false,
    error: error.message || "An error occurred",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };
};

export const logError = (message, context = {}) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${message}`, context);
  }

  captureMessage(message, "error");
};

export const logInfo = (message, context = {}) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[INFO] ${message}`, context);
  }

  captureMessage(message, "info");
};

export const logWarning = (message, context = {}) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[WARNING] ${message}`, context);
  }

  captureMessage(message, "warning");
};

export class AppError extends Error {
  constructor(message, statusCode = 500, context = {}) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message, context = {}) {
    super(message, 400, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed", context = {}) {
    super(message, 401, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You don't have permission to perform this action", context = {}) {
    super(message, 403, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", context = {}) {
    super(message, 404, context);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists", context = {}) {
    super(message, 409, context);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "An internal server error occurred", context = {}) {
    super(message, 500, context);
  }
}
