// src/models/Exercise.js

import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    equipment: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseType",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      required: true,
    },
    muscles: [
      {
        type: String,
        enum: [
          "CHEST",
          "BACK",
          "SHOULDERS",
          "BICEPS",
          "TRICEPS",
          "LEGS",
          "CORE",
          "FULL_BODY",
        ],
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
