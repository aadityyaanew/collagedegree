import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

// Helper: Generate URL-safe slug from title
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
    .replace(/^-+|-+$/g, ''); // trim - from ends
}

// Helper: Ensure slug uniqueness
async function getUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug || `post-${Date.now()}`;
  let count = 0;
  let uniqueSlug = slug;

  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await Blog.findOne(query).select('_id').lean();
    if (!existing) {
      return uniqueSlug;
    }
    count += 1;
    uniqueSlug = `${slug}-${count}`;
  }
}

// Helper: Calculate estimated read time from content
function calculateReadTime(text) {
  if (!text) return '3 min read';
  // Strip HTML tags
  const plainText = text.replace(/<[^>]+>/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(blogs, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const rawSlug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);
    const slug = await getUniqueSlug(rawSlug);

    const readTime = body.readTime || calculateReadTime(body.content);

    // Auto-generate excerpt if empty
    let excerpt = body.excerpt?.trim();
    if (!excerpt) {
      const plain = body.content.replace(/<[^>]+>/g, ' ').trim();
      excerpt = plain.slice(0, 160) + (plain.length > 160 ? '...' : '');
    }

    const status = body.status === 'published' ? 'published' : 'draft';
    const publishedAt = status === 'published' ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null;

    const blog = new Blog({
      title: body.title.trim(),
      slug,
      excerpt,
      content: body.content,
      featuredImage: body.featuredImage || '',
      category: body.category?.trim() || 'College Guide',
      tags: Array.isArray(body.tags) ? body.tags.map((t) => t.trim()).filter(Boolean) : [],
      status,
      author: {
        name: body.author?.name || 'Compare Degree Editorial Team',
        role: body.author?.role || 'Higher Education Analyst',
        avatar: body.author?.avatar || '',
      },
      seoTitle: body.seoTitle?.trim() || body.title.trim(),
      seoDescription: body.seoDescription?.trim() || excerpt,
      readTime,
      publishedAt,
    });

    await blog.save();

    // Revalidate relevant pages
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath('/admin/blogs');
    revalidatePath('/sitemap.xml');

    return NextResponse.json(blog, { status: 201, headers: noCacheHeaders });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const id = body._id || body.documentId || body.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing blog ID' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const existing = await Blog.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    let slug = existing.slug;
    if (body.slug && body.slug.trim()) {
      const formattedSlug = generateSlug(body.slug);
      if (formattedSlug !== existing.slug) {
        slug = await getUniqueSlug(formattedSlug, id);
      }
    }

    const readTime = body.readTime || calculateReadTime(body.content || existing.content);

    let excerpt = body.excerpt !== undefined ? body.excerpt?.trim() : existing.excerpt;
    if (!excerpt && body.content) {
      const plain = body.content.replace(/<[^>]+>/g, ' ').trim();
      excerpt = plain.slice(0, 160) + (plain.length > 160 ? '...' : '');
    }

    const status = body.status || existing.status;
    let publishedAt = existing.publishedAt;
    if (status === 'published' && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    }

    const updateData = {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      slug,
      excerpt,
      content: body.content !== undefined ? body.content : existing.content,
      featuredImage: body.featuredImage !== undefined ? body.featuredImage : existing.featuredImage,
      category: body.category !== undefined ? body.category.trim() : existing.category,
      tags: Array.isArray(body.tags)
        ? body.tags.map((t) => t.trim()).filter(Boolean)
        : existing.tags,
      status,
      author: {
        name: body.author?.name || existing.author?.name || 'Compare Degree Editorial Team',
        role: body.author?.role || existing.author?.role || 'Higher Education Analyst',
        avatar: body.author?.avatar !== undefined ? body.author?.avatar : existing.author?.avatar,
      },
      seoTitle: body.seoTitle !== undefined ? body.seoTitle.trim() : existing.seoTitle,
      seoDescription: body.seoDescription !== undefined ? body.seoDescription.trim() : existing.seoDescription,
      readTime,
      publishedAt,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    // Revalidate paths
    revalidatePath('/blog');
    revalidatePath(`/blog/${existing.slug}`);
    if (updatedBlog.slug !== existing.slug) {
      revalidatePath(`/blog/${updatedBlog.slug}`);
    }
    revalidatePath('/admin/blogs');
    revalidatePath('/sitemap.xml');

    return NextResponse.json(updatedBlog, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update blog' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing blog ID' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const deleted = await Blog.findByIdAndDelete(id);

    if (deleted) {
      revalidatePath('/blog');
      revalidatePath(`/blog/${deleted.slug}`);
      revalidatePath('/admin/blogs');
      revalidatePath('/sitemap.xml');
    }

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
