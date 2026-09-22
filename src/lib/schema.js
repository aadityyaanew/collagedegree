/**
 * Structured Data (JSON-LD) generators for Search Engine Optimization.
 * Conforms to Schema.org standards recognized by Google, Bing, and other search engines.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comparedegree.com';

/**
 * Organization & WebSite Schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Compare Degree',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      caption: 'Compare Degree Logo',
    },
    description:
      "India's premier college and course comparison portal. Compare fees, NIRF rankings, placements, and cutoffs side-by-side.",
    email: 'info@comparedegree.com',
    telephone: '+91 8377959878',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Spectrum@Metro, Plot C & D Gardenia Gateway, Sector 75',
      addressLocality: 'Noida',
      postalCode: '201316',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/comparedegree',
      'https://www.facebook.com/share/19ibumY2z2/',
      'https://www.linkedin.com/company/compare-degree/',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Compare Degree',
    url: SITE_URL,
    description:
      'Compare colleges, courses, fees, placements, rankings, and reviews side by side.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/colleges?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * College or University Schema
 */
export function getCollegeSchema(college) {
  if (!college) return null;

  const collegeUrl = `${SITE_URL}/colleges/${college.id || college._id}`;
  const cityName = college.location?.city || 'India';
  const stateName = college.location?.state || 'India';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    '@id': collegeUrl,
    name: college.name,
    alternateName: college.shortName || college.name,
    url: collegeUrl,
    logo: college.logo || `${SITE_URL}/logo.png`,
    image: college.campus || `${SITE_URL}/campus-placeholder.jpg`,
    description:
      college.about ||
      `${college.name} (${college.shortName}) located in ${cityName}, ${stateName}. NIRF Rank #${college.nirfRanking || 'N/A'}, NAAC Grade ${college.naacGrade || 'A'}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: stateName,
      addressCountry: 'IN',
    },
    foundingDate: college.established ? String(college.established) : undefined,
    award: [
      college.nirfRanking ? `NIRF Ranking #${college.nirfRanking}` : null,
      college.naacGrade ? `NAAC Grade ${college.naacGrade}` : null,
    ].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Courses at ${college.shortName || college.name}`,
      itemListElement: (college.coursesOffered || []).map((c, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: c,
        },
        position: index + 1,
      })),
    },
  };
}

/**
 * Course Schema
 */
export function getCourseSchema(course) {
  if (!course) return null;

  const courseUrl = `${SITE_URL}/courses/${course.slug || course.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': courseUrl,
    name: course.name,
    alternateName: course.shortName || course.name,
    description: course.description || `${course.name} degree course curriculum, duration, eligibility, and top universities in India.`,
    url: courseUrl,
    image: course.image || `${SITE_URL}/courses/course-cse.jpg`,
    educationalLevel: course.level === 'UG' ? 'Undergraduate' : 'Postgraduate',
    timeRequired: course.duration || '3-4 Years',
    occupationalCategory: (course.careers || []).join(', '),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Full-time / Online',
      courseWorkload: course.duration,
    },
    offers: course.avgFees
      ? {
          '@type': 'Offer',
          price: course.avgFees,
          priceCurrency: 'INR',
          category: 'Average Tuition Fees',
        }
      : undefined,
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * ItemList Schema for listings (Colleges / Courses)
 */
export function getItemListSchema(title, items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
