import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: {
      name: { type: String, default: 'London Express Removals' },
      avatar: { type: String },
    },
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ['Moving Tips', 'Packing', 'London Areas', 'Company News', 'Guides'],
      default: 'Moving Tips',
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
