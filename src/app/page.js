import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  HeroSection,
  TrustedUniversitiesSection,
  FeaturesSection,
  ExploreCoursesSection,
  HowItWorksSection,
  TestimonialsSection,
  ContactSection,
  DegreeComparisonSection,
} from "@/components/home";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  await dbConnect();
  // Fetch courses and serialize them for the client component
  const dbCourses = await Course.find({}).lean();
  const courses = dbCourses.map(c => ({
    ...c,
    _id: c._id.toString(),
    id: c.slug, // mapping for the frontend to use
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <TrustedUniversitiesSection />
        <FeaturesSection />
        <ExploreCoursesSection courseList={courses} />
        <DegreeComparisonSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
