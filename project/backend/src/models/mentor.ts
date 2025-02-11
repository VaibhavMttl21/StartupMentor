import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
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

export const Mentor = mongoose.model('Mentor', mentorSchema);