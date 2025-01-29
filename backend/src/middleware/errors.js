// src/middleware/errors.js
import { GraphQLError } from 'graphql';

export class BaseError extends GraphQLError {
  constructor(message, code, status, details = {}) {
    super(message, {
      extensions: {
        code,
        http: { status },
        details
      }
    });
  }
}

export class ValidationError extends BaseError {
  constructor(message, details = {}) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class DuplicateError extends BaseError {
  constructor(message, field) {
    super(
      message,
      'DUPLICATE_ERROR',
      409,
      { field }
    );
  }
}

export class NotFoundError extends BaseError {
  constructor(entity, id) {
    super(
      `${entity} with ID ${id} not found`,
      'NOT_FOUND',
      404,
      { entity, id }
    );
  }
}