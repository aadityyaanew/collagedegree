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

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(blog, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    // Support quick toggle of status
    if (body.status) {
      blog.status = body.status;
      if (body.status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();

    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath('/admin/blogs');
    revalidatePath('/sitemap.xml');

    return NextResponse.json(blog, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error updating blog status:', error);
    return NextResponse.json(
      { error: 'Failed to update blog status' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
