import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Course slug is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    let course = null;

    try {
      await dbConnect();
      course = await Course.findOne({
        $or: [
          { slug: slug },
          { slug: slug.toLowerCase() },
        ],
      }).lean();
    } catch (dbError) {
      console.error('Database query error in /api/courses/[slug]:', dbError);
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(course, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
