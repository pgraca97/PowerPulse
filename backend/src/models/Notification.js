// backend/src/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,  // Firebase UID
            required: true,
            index: true
        },
        type: {
            type: String,
            required: true,
            enum: ['NEW_EXERCISE', 'LEVEL_UP', 'ACHIEVEMENT']  // We can expand later
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        data: {
            type: mongoose.Schema.Types.Mixed,  // Additional data specific to the type
            default: {}
        }
    },
    { 
        timestamps: true 
    }
);

// Compound index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);