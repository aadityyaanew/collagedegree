import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

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
    const {
      name,
      phone,
      email,
      state,
      city,
      preferredCourse,
      course,
      source,
      education,
      stream,
      percentage,
      workingStatus,
      budget,
      answersSummary,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone Number are required." },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const resolvedAnswersSummary = answersSummary || {};
    const lead = new Lead({
      name: name.trim(),
      phone: phone.trim(),
      email: (email || "").trim().toLowerCase(),
      city: (city || "").trim(),
      state: state || "Not specified",
      preferredCourse: preferredCourse || course || "General Counselling",
      source: source || "Website Lead Form",
      education: (education || resolvedAnswersSummary.education || "").trim(),
      stream: (stream || resolvedAnswersSummary.stream || "").trim(),
      percentage: (percentage || resolvedAnswersSummary.percentage || "").trim(),
      workingStatus: (workingStatus || resolvedAnswersSummary.workingStatus || "").trim(),
      budget: (budget || resolvedAnswersSummary.budget || "").trim(),
      answersSummary: resolvedAnswersSummary,
    });

    await lead.save();

    revalidatePath('/admin');
    revalidatePath('/admin/leads');

    return NextResponse.json(
      {
        success: true,
        message: "Counselling lead received successfully",
        leadId: lead._id,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("Error processing counselling submission:", error);
    return NextResponse.json(
      { error: "Failed to process counselling request" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const totalLeads = await Lead.countDocuments();
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(10);
    
    return NextResponse.json(
      {
        totalLeads,
        leads,
      },
      { headers: noCacheHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
