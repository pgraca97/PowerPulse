// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
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
  picture: {
    url: String,
    publicId: String,
    resourceType: {
      type: String,
      enum: ['IMAGE', 'VIDEO'],
      default: 'IMAGE'
    }
  },
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