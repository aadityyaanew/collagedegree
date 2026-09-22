import dbConnect from "@/lib/mongodb";
import College from "@/models/College";
import CollegesClient from "./CollegesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CollegesPage() {
  let initialColleges = [];
  try {
    await dbConnect();
    const dbColleges = await College.find({}).sort({ createdAt: -1 }).lean();
    if (dbColleges && dbColleges.length > 0) {
      initialColleges = dbColleges.map((c) => ({
        ...c,
        _id: c._id.toString(),
        id: c.id || c._id.toString(),
      }));
    }
  } catch (err) {
    console.error("Error loading colleges in Server Component:", err);
  }

  return <CollegesClient initialColleges={initialColleges} />;
}
