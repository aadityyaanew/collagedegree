import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [350, 'Excerpt cannot exceed 350 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'College Guide',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    author: {
      name: { type: String, default: 'Compare Degree Editorial Team' },
      role: { type: String, default: 'Higher Education Analyst' },
      avatar: { type: String, default: '' },
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'SEO title cannot exceed 100 characters'],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [200, 'SEO description cannot exceed 200 characters'],
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast public listing & sorting
blogSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
