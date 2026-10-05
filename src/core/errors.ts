export class AppError extends Error {
  constructor(message: string, readonly code: string, readonly statusCode = 500, readonly details?: Record<string, unknown>) {
    super(message);
    this.name = new.target.name;
  }
}
export class ValidationError extends AppError { constructor(message: string, details?: Record<string, unknown>) { super(message, "VALIDATION_ERROR", 400, details); } }
export class AuthenticationError extends AppError { constructor(message = "Authentication required") { super(message, "AUTHENTICATION_ERROR", 401); } }
export class AuthorizationError extends AppError { constructor(message = "Insufficient permissions") { super(message, "AUTHORIZATION_ERROR", 403); } }
export class NotFoundError extends AppError { constructor(resource: string) { super(`${resource} not found`, "NOT_FOUND", 404); } }
