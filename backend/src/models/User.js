import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    isAdmin: {
      type: Boolean,
      default: false
    },
    picture: {
      url: String,
      publicId: String,
      resourceType: {
        type: String,
        enum: ["IMAGE", "VIDEO"],
        default: "IMAGE",
      },
    },
    profile: {
      height: Number,
      weight: Number,
      goals: [String],
      fitnessLevel: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      },
    },
    progress: [
      {
        exerciseTypeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ExerciseType",
          required: true,
        },
        level: {
          type: Number,
          default: 0,
        },
        points: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
