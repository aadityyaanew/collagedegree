import dbConnect from '@/lib/mongodb';
import College from '@/models/College';
import Course from '@/models/Course';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparedegree.com';

export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticRoutes = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/colleges`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/course-finder`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/scholarships`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let collegeRoutes = [];
  let courseRoutes = [];

  try {
    await dbConnect();

    // Fetch dynamic colleges
    const colleges = await College.find({}, 'id updatedAt createdAt').lean();
    if (colleges && colleges.length > 0) {
      collegeRoutes = colleges
        .filter((c) => c.id)
        .map((c) => ({
          url: `${SITE_URL}/colleges/${c.id}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt).toISOString() : currentDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }

    // Fetch dynamic courses
    const courses = await Course.find({}, 'slug updatedAt createdAt').lean();
    if (courses && courses.length > 0) {
      courseRoutes = courses
        .filter((c) => c.slug)
        .map((c) => ({
          url: `${SITE_URL}/courses/${c.slug}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt).toISOString() : currentDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap from MongoDB:', error);
  }

  return [...staticRoutes, ...collegeRoutes, ...courseRoutes];
}
