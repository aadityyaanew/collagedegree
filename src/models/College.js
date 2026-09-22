import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    type: { type: String, required: true },
    established: { type: Number },
    nirfRanking: { type: Number },
    naacGrade: { type: String },
    fees: { type: Map, of: Number }, // e.g., { "btech": 1600000, "mba": 400000 }
    avgPackage: { type: Number },
    highestPackage: { type: Number },
    coursesOffered: [{ type: String }],
    logo: { type: String },
    campus: { type: String },
    about: { type: String },
    topRecruiters: [{ type: String }],
    cutoff: { type: Map, of: String }, // e.g., { "merit": "50% marks" }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.College || mongoose.model('College', collegeSchema);
