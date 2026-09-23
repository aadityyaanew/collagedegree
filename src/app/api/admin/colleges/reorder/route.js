import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import College from '@/models/College';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: 'orderedIds must be a non-empty array of college IDs' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const bulkOps = orderedIds.map((id, index) => {
      const isObjectId = typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
      const filter = isObjectId
        ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { id }] }
        : { id };
      return {
        updateOne: {
          filter,
          update: { $set: { order: index } },
        },
      };
    });

    const result = await College.bulkWrite(bulkOps);

    revalidatePath('/');
    revalidatePath('/colleges');
    revalidatePath('/api/colleges');
    revalidatePath('/admin/colleges');
    revalidatePath('/compare');

    return NextResponse.json(
      { success: true, count: orderedIds.length },
      { headers: noCacheHeaders }
    );
  } catch (error) {
    console.error('Error reordering colleges:', error);
    return NextResponse.json(
      { error: 'Failed to reorder colleges' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
