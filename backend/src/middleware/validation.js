// src/middleware/validation.js
import mongoose from 'mongoose';
import { ValidationError, DuplicateError, NotFoundError } from './errors.js';


export {
    ValidationError,
    NotFoundError,
    DuplicateError
  };

export const validateObjectId = (id, fieldName = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError(
      `Invalid ${fieldName} format`,
      { [fieldName]: 'Must be a valid ObjectId' }
    );
  }
};

export const validateRequiredFields = (input, fields) => {
  const missingFields = fields.filter(field => !input[field]);
  if (missingFields.length > 0) {
    throw new ValidationError(
      'Missing required fields',
      missingFields.reduce((acc, field) => ({
        ...acc,
        [field]: 'Field is required'
      }), {})
    );
  }
};

export const handleMongoError = (error) => {
  if (error.code === 11000) { // mongo db duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    throw new DuplicateError(
      `${field} "${value}" already exists`,
      field
    );
  }
  throw error;
};