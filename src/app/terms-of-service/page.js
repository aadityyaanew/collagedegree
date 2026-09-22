import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service - Compare Degree",
  description: "Terms and conditions for using Compare Degree.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 py-16">
        <div className="container-main max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Terms of Service</h1>
            <p className="text-slate-500 mb-8 pb-8 border-b border-slate-100">Last updated: September 2026</p>

            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
              <p>
                Welcome to Compare Degree! By accessing this website, we assume you accept these terms and conditions. Do not continue to use Compare Degree if you do not agree to take all of the terms and conditions stated on this page.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Compare Degree's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
              <p>Under this license you may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on the website;</li>
                <li>remove any copyright or other proprietary notations from the materials;</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">3. Disclaimer regarding College Data</h2>
              <p>
                The materials on Compare Degree's website are provided on an 'as is' basis. While we strive to provide accurate fee structures, placement statistics, and university details, these are subject to change by the respective institutions. We do not warrant or make any representations concerning the absolute accuracy, likely results, or reliability of the use of the materials on its website. Students are advised to verify details independently before enrollment.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">4. Limitations</h2>
              <p>
                In no event shall Compare Degree or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Compare Degree's website, even if an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">5. Revisions and Errata</h2>
              <p>
                The materials appearing on Compare Degree's website could include technical, typographical, or photographic errors. Compare Degree does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">6. Contact Information</h2>
              <p>
                If you have any questions regarding these terms, please contact us at info@comparedegree.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
