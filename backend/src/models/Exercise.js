// src/models/Exercise.js

import mongoose from "mongoose";
import { DIFFICULTY_LEVELS, MUSCLE_GROUPS } from "../constants/exercise.js";

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
    },
    equipment: {
      type: String,
      required: true
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseType",
      required: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: true,
    },
    muscles: [
      {
        type: String,
        enum: MUSCLE_GROUPS,
        required: true,
      },
    ],
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
    pointsAwarded: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  { timestamps: true }
);

export const Exercise = mongoose.model("Exercise", exerciseSchema);
