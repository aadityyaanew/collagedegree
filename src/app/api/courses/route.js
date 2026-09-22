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

export async function GET() {
  try {
    await dbConnect();
    let courses = await Course.find({}).sort({ name: 1 }).lean();
    if (!courses || courses.length === 0) {
      courses = [];
    }
    return NextResponse.json(courses, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to fetch courses from DB:', error);
    return NextResponse.json([], { headers: noCacheHeaders });
  }
}
