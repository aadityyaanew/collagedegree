import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      default: 'Not specified',
    },
    preferredCourse: {
      type: String,
      default: 'General Counselling',
    },
    source: {
      type: String,
      default: 'Website Popup',
    },
    education: {
      type: String,
      default: '',
    },
    stream: {
      type: String,
      default: '',
    },
    percentage: {
      type: String,
      default: '',
    },
    workingStatus: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      default: '',
    },
    answersSummary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

// If the model exists, use it. Otherwise, create it.
export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
