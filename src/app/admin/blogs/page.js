"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Search,
  BookOpen,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Tag,
  X,
  Sparkles,
  Globe,
  Share2,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/shared/ImageUpload";


const PRESET_CATEGORIES = [
  "College Comparison",
  "Admissions Guide",
  "Career Advice",
  "Entrance Exams",
  "Online Degrees",
  "Courses & Syllabus",
  "Scholarships",
  "Placement Insights",
];

const emptyFormData = {
  _id: null,
  title: "",
  slug: "",
  category: "College Comparison",
  customCategory: "",
  tags: [],
  tagInput: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  status: "published",
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
  authorName: "Compare Degree Editorial Team",
  authorRole: "Higher Education Analyst",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to slugify
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugManuallyEdited ? prev.slug : slugify(val),
      seoTitle: prev.seoTitle === prev.title || !prev.seoTitle ? val : prev.seoTitle,
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = formData.tagInput.trim().replace(/^,+|,+$/g, "");
      if (val && !formData.tags.includes(val)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, val],
          tagInput: "",
        }));
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setSlugManuallyEdited(false);
    setFormData({
      ...emptyFormData,
      publishedAt: new Date().toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setSlugManuallyEdited(true);
    setFormData({
      _id: blog._id,
      title: blog.title || "",
      slug: blog.slug || "",
      category: PRESET_CATEGORIES.includes(blog.category) ? blog.category : "Other",
      customCategory: PRESET_CATEGORIES.includes(blog.category) ? "" : blog.category,
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      tagInput: "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featuredImage: blog.featuredImage || "",
      status: blog.status || "draft",
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString().slice(0, 16)
        : "",
      seoTitle: blog.seoTitle || blog.title || "",
      seoDescription: blog.seoDescription || blog.excerpt || "",
      authorName: blog.author?.name || "Compare Degree Editorial Team",
      authorRole: blog.author?.role || "Higher Education Analyst",
    });
    setIsModalOpen(true);
  };

  const handleQuickStatusToggle = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBlogs(blogs.map((b) => (b._id === blog._id ? { ...b, status: newStatus } : b)));
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlogs(blogs.filter((b) => b._id !== id));
      } else {
        alert("Failed to delete blog post.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting blog post.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please provide a blog title.");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter the blog post content.");
      return;
    }

    const finalCategory =
      formData.category === "Other" && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || slugify(formData.title),
      category: finalCategory,
      tags: formData.tags,
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      featuredImage: formData.featuredImage,
      status: formData.status,
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
      seoTitle: formData.seoTitle.trim() || formData.title.trim(),
      seoDescription: formData.seoDescription.trim() || formData.excerpt.trim(),
      author: {
        name: formData.authorName.trim(),
        role: formData.authorRole.trim(),
      },
    };

    setIsSubmitting(true);
    try {
      const isEditing = Boolean(editingBlog);
      const url = "/api/admin/blogs";
      const method = isEditing ? "PUT" : "POST";

      if (isEditing) {
        payload._id = editingBlog._id;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (isEditing) {
          setBlogs(blogs.map((b) => (b._id === saved._id ? saved : b)));
        } else {
          setBlogs([saved, ...blogs]);
        }
        setIsModalOpen(false);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save blog post");
      }
    } catch (err) {
      console.error("Save blog error:", err);
      alert("An error occurred while saving the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.title?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q) ||
      (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(q)));

    const matchesStatus =
      statusFilter === "all" || b.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "all" || b.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPublished = blogs.filter((b) => b.status === "published").length;
  const totalDrafts = blogs.filter((b) => b.status === "draft").length;
  const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
  const categoriesList = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy tracking-tight">Blog Management</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {blogs.length} Articles
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish educational guides, comparison analyses, and boost your website topical SEO authority.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-navy transition-all"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>View Public Blog</span>
          </Link>
          <Button
            onClick={openCreateModal}
            className="bg-crimson hover:bg-crimson-dark text-white font-bold px-4 py-2 text-xs rounded-xl shadow-md shadow-crimson/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Blog Post</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Articles
          </span>
          <div className="text-2xl font-extrabold text-navy">{blogs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
            Published Live
          </span>
          <div className="text-2xl font-extrabold text-emerald-600">{totalPublished}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-1">
            Drafts
          </span>
          <div className="text-2xl font-extrabold text-amber-600">{totalDrafts}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, keyword, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-crimson/20 focus:border-crimson/30 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-crimson/20 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-crimson/20 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-28">
            <Loader2 className="h-8 w-8 text-crimson animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-center px-4">
            <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="text-base font-bold text-navy">No blog posts found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try clearing your search query or filters."
                : "Create your very first blog article to start improving website traffic and SEO!"}
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
              <Button
                onClick={openCreateModal}
                className="mt-4 bg-crimson hover:bg-crimson-dark text-white text-xs font-bold rounded-xl"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Write First Blog
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 whitespace-nowrap">
              <thead className="text-xs text-slate-400 uppercase bg-slate-50/70 border-b border-slate-100 font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Article</th>
                  <th scope="col" className="px-6 py-4">Category & Tags</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Readers</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* 1. Article & Thumbnail */}
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                          {blog.featuredImage ? (
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FileText className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="font-bold text-navy hover:text-crimson transition-colors block truncate text-sm"
                            title={blog.title}
                          >
                            {blog.title}
                          </Link>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] truncate max-w-[200px]">
                              /blog/{blog.slug}
                            </span>
                            <span>&bull;</span>
                            <span>{blog.readTime || "4 min read"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Category & Tags */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-crimson border border-rose-100">
                          {blog.category}
                        </span>
                        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[200px]">
                            <Tag className="h-3 w-3 shrink-0" />
                            <span className="truncate">{blog.tags.slice(0, 3).join(", ")}</span>
                            {blog.tags.length > 3 && <span>+{blog.tags.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 3. Status */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleQuickStatusToggle(blog)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          blog.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            blog.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <span className="capitalize">{blog.status}</span>
                      </button>
                    </td>

                    {/* 4. Views */}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        <span>{(blog.views || 0).toLocaleString()}</span>
                      </div>
                    </td>

                    {/* 5. Date */}
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : new Date(blog.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                        </span>
                      </div>
                    </td>

                    {/* 6. Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
                          title="Open Live Public Article"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Blog"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog._id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Blog"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blog Create / Edit Full Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-crimson text-white flex items-center justify-center shadow-md shadow-crimson/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-navy">
                    {editingBlog ? "Edit Blog Article" : "Create New Blog Article"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure rich content, SEO metadata, categories, and publication status.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Blog Title <span className="text-crimson">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech CSE vs B.Tech AI & Data Science: Complete 2025 Comparison"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-navy focus:bg-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson/30 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      URL Slug <span className="text-crimson">*</span>
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-crimson/20 focus-within:border-crimson/30 transition-all">
                      <span className="text-xs text-slate-400 mr-1 select-none font-mono">/blog/</span>
                      <input
                        type="text"
                        required
                        placeholder="btech-cse-vs-btech-ai-comparison"
                        value={formData.slug}
                        onChange={(e) => {
                          setSlugManuallyEdited(true);
                          setFormData({ ...formData, slug: slugify(e.target.value) });
                        }}
                        className="bg-transparent border-none outline-none text-xs font-mono text-slate-700 w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Category <span className="text-crimson">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-crimson/20"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Other">+ Custom Category...</option>
                    </select>

                    {formData.category === "Other" && (
                      <input
                        type="text"
                        placeholder="Type custom category name..."
                        value={formData.customCategory}
                        onChange={(e) =>
                          setFormData({ ...formData, customCategory: e.target.value })
                        }
                        className="mt-2 w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-crimson/20"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Featured Header Image (Uploaded to Cloudinary)
                </label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  folder="blog_featured"
                  placeholder="Upload Blog Cover Image"
                  recommendedSize="Recommended: 16:9 ratio (Landscape WebP/JPEG)"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Article Body & Content <span className="text-crimson">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write an insightful, comprehensive guide for students comparing degrees..."
                  rows={15}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-crimson/20 transition-all font-mono"
                />
              </div>

              {/* Excerpt / Summary */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Summary / Excerpt (Displayed on Cards)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.excerpt.length}/350 chars
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={350}
                  placeholder="A short, catchy overview of what this article covers for preview cards and social shares..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-crimson/20 transition-all"
                />
              </div>

              {/* Tags & Publishing Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Tags (Press Enter to add)
                  </label>
                  <div className="min-h-[42px] p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-crimson/20">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tag (e.g. btech, placements)..."
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      onKeyDown={handleAddTag}
                      className="bg-transparent border-none outline-none text-xs text-slate-700 flex-1 min-w-[120px] px-1"
                    />
                  </div>
                </div>

                {/* Status & Publication Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Publish Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-crimson/20"
                    >
                      <option value="published">🟢 Published</option>
                      <option value="draft">🟡 Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-crimson/20"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Google Optimization Section */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Google SEO Metadata & SERP Snippet
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600">SEO Meta Title</label>
                      <span className="text-[10px] text-slate-400">
                        {formData.seoTitle.length}/60 recommended
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Title tag shown on Google Search results..."
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-crimson/20"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600">
                        SEO Meta Description
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {formData.seoDescription.length}/160 recommended
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Snippet shown under title in Google Search..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-crimson/20"
                    />
                  </div>
                </div>

                {/* Live Google Search Preview Box */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Live Google Search SERP Preview
                  </span>
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-700 flex items-center gap-1.5 font-sans">
                      <span className="font-bold text-navy">Compare Degree</span>
                      <span className="text-slate-400">&rsaquo;</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        blog &rsaquo; {formData.slug || "your-slug"}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                      {formData.seoTitle || formData.title || "Your Blog Post Title"} | Compare Degree
                    </h4>
                    <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                      {formData.seoDescription ||
                        formData.excerpt ||
                        "Read this in-depth guide on Compare Degree to make smart education decisions..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Author Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-crimson/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Author Designation / Role
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-crimson/20"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-semibold px-4 border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-bold px-6 shadow-md shadow-crimson/20"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : editingBlog ? (
                    "Update Blog Article"
                  ) : (
                    "Publish Article"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
