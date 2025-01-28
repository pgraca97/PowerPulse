// src/models/ExerciseType.js
import mongoose from "mongoose";

const exerciseTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  { timestamps: true }
);

export const ExerciseType = mongoose.model("ExerciseType", exerciseTypeSchema);
