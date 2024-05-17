import mongoose, { mongo } from "mongoose";
import { nanoid } from "nanoid";

const LENGTH = 10;

const shortUrlSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    customCode: {
        type: String,
        required: false,
        unique: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    fullUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(LENGTH)
    },
    clicks: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    archived: {
        type: Boolean,
        default: false
    }
    }, 
    {
    timestamps: true
    }
);

export const urlModel = mongoose.model("shortUrl", shortUrlSchema);