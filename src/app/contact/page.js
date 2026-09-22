import ContactClient from "./ContactClient";
import { getBreadcrumbSchema } from "@/lib/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://comparedegree.com";

export const metadata = {
  title: "Contact Us & Free Admission Counselling — Compare Degree",
  description:
    "Get in touch with Compare Degree for free expert admission counselling, university comparisons, scholarship guidance, and higher education queries across India.",
  keywords: [
    "contact compare degree",
    "free admission counselling",
    "education consultant India",
    "college admission helpline",
    "online degree guidance",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & Free Admission Counselling — Compare Degree",
    description:
      "Have questions about universities, degrees, or admissions? Talk to our certified education counsellors today.",
    url: `${SITE_URL}/contact`,
    siteName: "Compare Degree",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/heroimg.jpeg",
        width: 1200,
        height: 630,
        alt: "Contact Compare Degree",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Compare Degree",
    description: "Reach out to our admission counsellors for 100% free guidance.",
    images: ["/heroimg.jpeg"],
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Compare Degree",
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "EducationalOrganization",
      name: "Compare Degree",
      telephone: "+91 8377959878",
      email: "info@comparedegree.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Spectrum@Metro, Plot C & D Gardenia Gateway, Sector 75",
        addressLocality: "Noida",
        postalCode: "201316",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
    },
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactClient />
    </>
  );
}
