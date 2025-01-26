// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  picture: String,
  profile: {
    height: Number,
    weight: Number,
    goals: [String],
    fitnessLevel: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
    }
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);