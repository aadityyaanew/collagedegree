import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, required: true }, // e.g., 'UG', 'PG'
    duration: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    slug: { type: String, required: true, unique: true },
    shortName: { type: String },
    avgFees: { type: Number },
    image: { type: String },
    topColleges: [{ type: String }],
    eligibilityExams: [{ type: String }],
    subjects: [{ type: String }],
    careers: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
