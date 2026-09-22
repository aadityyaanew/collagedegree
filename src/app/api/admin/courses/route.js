import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const course = new Course(body);
    await course.save();

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/courses/[id]', 'page');
    revalidatePath('/admin/courses');

    return NextResponse.json(course, { status: 201, headers: noCacheHeaders });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
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
      return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: noCacheHeaders });
    }

    await Course.findByIdAndDelete(id);

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/courses/[id]', 'page');
    revalidatePath('/admin/courses');

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: noCacheHeaders });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });

    revalidatePath('/');
    revalidatePath('/courses');
    revalidatePath('/courses/[id]', 'page');
    revalidatePath('/admin/courses');

    return NextResponse.json(updatedCourse, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
