import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import College from '@/models/College';
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

    const [leads, colleges, courses] = await Promise.all([
      Lead.countDocuments(),
      College.countDocuments(),
      Course.countDocuments(),
    ]);

    return NextResponse.json(
      {
        leads,
        colleges,
        courses,
      },
      { headers: noCacheHeaders }
    );
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
