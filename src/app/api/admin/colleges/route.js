import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import College from '@/models/College';

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
    const colleges = await College.find({}).sort({ createdAt: -1 });
    return NextResponse.json(colleges, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Auto-generate slug id if missing
    if (!body.id) {
      body.id = (body.shortName || body.name || `college-${Date.now()}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const college = new College(body);
    await college.save();

    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath('/api/colleges');
    if (college.id) {
      revalidatePath(`/colleges/${college.id}`);
    }
    revalidatePath('/colleges/[id]', 'page');
    revalidatePath('/compare');
    revalidatePath('/admin/colleges');

    return NextResponse.json(college, { status: 201, headers: noCacheHeaders });
  } catch (error) {
    console.error('Error creating college:', error);
    return NextResponse.json(
      { error: 'Failed to create college' },
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

    const deleted = (await College.findByIdAndDelete(id)) || (await College.findOneAndDelete({ id }));

    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath('/api/colleges');
    if (deleted?.id) {
      revalidatePath(`/colleges/${deleted.id}`);
    }
    revalidatePath('/colleges/[id]', 'page');
    revalidatePath('/compare');
    revalidatePath('/admin/colleges');

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error deleting college:', error);
    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const targetId = body.documentId || body._id || (body.id && body.id.length === 24 ? body.id : null);

    if (!targetId) {
      return NextResponse.json({ error: 'Missing documentId or _id' }, { status: 400, headers: noCacheHeaders });
    }

    const updateData = { ...body };
    delete updateData.documentId;
    delete updateData._id;

    const existingCollege = await College.findById(targetId);
    if (!existingCollege) {
      return NextResponse.json({ error: 'College not found' }, { status: 404, headers: noCacheHeaders });
    }

    // Preserve existing slug id if updateData.id was erroneously set to the Mongo ObjectId
    if (!updateData.id || updateData.id === targetId) {
      updateData.id = existingCollege.id || targetId;
    }

    const updatedCollege = await College.findByIdAndUpdate(targetId, updateData, { new: true });

    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath('/api/colleges');
    if (updatedCollege?.id) {
      revalidatePath(`/colleges/${updatedCollege.id}`);
    }
    revalidatePath('/colleges/[id]', 'page');
    revalidatePath('/compare');
    revalidatePath('/admin/colleges');

    return NextResponse.json(updatedCollege, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error updating college:', error);
    return NextResponse.json(
      { error: 'Failed to update college' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
