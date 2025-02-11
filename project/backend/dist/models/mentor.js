"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mentor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mentorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Investor', 'Mentor'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.Mentor = mongoose_1.default.model('Mentor', mentorSchema);
