import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

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
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return NextResponse.json(leads, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400, headers: noCacheHeaders });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404, headers: noCacheHeaders });
    }

    revalidatePath('/admin');
    revalidatePath('/admin/leads');

    return NextResponse.json(updatedLead, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
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

    await Lead.findByIdAndDelete(id);

    revalidatePath('/admin');
    revalidatePath('/admin/leads');

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
