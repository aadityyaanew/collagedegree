import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import College from '@/models/College';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const normalizeFees = (fees) => {
  if (!fees) return {};
  if (fees instanceof Map) return Object.fromEntries(fees);
  if (typeof fees === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(fees)) {
      if (v !== undefined && v !== null && v !== '') {
        result[k.toLowerCase()] = Number(v) || v;
      }
    }
    return result;
  }
  return {};
};

const normalizeCutoff = (cutoff) => {
  if (!cutoff) return {};
  if (cutoff instanceof Map) return Object.fromEntries(cutoff);
  if (typeof cutoff === 'object') {
    return { ...cutoff };
  }
  return {};
};

const normalizeCollege = (c) => {
  const loc = typeof c.location === 'string'
    ? { city: c.location.split(',')[0]?.trim() || 'Online', state: c.location.split(',')[1]?.trim() || 'India' }
    : (c.location?.city ? c.location : { city: 'Online', state: 'India' });

  return {
    ...c,
    _id: c._id ? c._id.toString() : undefined,
    id: c.id || (c._id ? c._id.toString() : ''),
    name: c.name,
    shortName: c.shortName || c.name,
    location: loc,
    type: c.type || 'Private',
    established: c.established,
    nirfRanking: c.nirfRanking,
    naacGrade: c.naacGrade || 'A',
    logo: c.logo || c.image || '',
    campus: c.campus || '/campus-placeholder.jpg',
    fees: normalizeFees(c.fees),
    cutoff: normalizeCutoff(c.cutoff),
    coursesOffered: (Array.isArray(c.coursesOffered) && c.coursesOffered.length > 0) 
      ? c.coursesOffered 
      : (Array.isArray(c.courses) && c.courses.length > 0 ? c.courses : []),
    avgPackage: typeof c.avgPackage === 'number' && c.avgPackage > 0 ? c.avgPackage : (parseFloat(c.avgPackage || c.placements?.average || 0) || 0),
    highestPackage: typeof c.highestPackage === 'number' && c.highestPackage > 0 ? c.highestPackage : (parseFloat(c.highestPackage || c.placements?.highest || 0) || 0),
    about: c.about || '',
    topRecruiters: (Array.isArray(c.topRecruiters) && c.topRecruiters.length > 0) ? c.topRecruiters : [],
    order: typeof c.order === 'number' ? c.order : 0,
  };
};

export async function GET() {
  try {
    await dbConnect();
    let colleges = await College.find({}).sort({ order: 1, createdAt: -1 }).lean();

    if (!colleges || colleges.length === 0) {
      colleges = [];
    } else {
      colleges.sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : 999999;
        const orderB = typeof b.order === 'number' ? b.order : 999999;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    }

    const normalized = colleges.map(normalizeCollege);
    return NextResponse.json(normalized, { headers: noCacheHeaders });
  } catch (error) {
    console.error('Failed to fetch colleges from DB:', error);
    return NextResponse.json([], { headers: noCacheHeaders });
  }
}
