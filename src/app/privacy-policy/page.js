import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy - Compare Degree",
  description: "Privacy Policy and data protection guidelines.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 py-16">
        <div className="container-main max-w-4xl">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Privacy Policy</h1>
            <p className="text-slate-500 mb-8 pb-8 border-b border-slate-100">Last updated: September 2026</p>

            <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
              <p>
                At Compare Degree, accessible from comparedegree, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Compare Degree and how we use it.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">1. Information We Collect</h2>
              <p>
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>When you submit a counselling form, we may collect your name, phone number, state, and academic preferences.</li>
                <li>We may receive additional information about you such as your email address, phone number, the contents of the message and/or attachments you may send us.</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain our website.</li>
                <li>Improve, personalize, and expand our website.</li>
                <li>Communicate with you directly for expert counselling and academic advice.</li>
                <li>Send you emails or SMS regarding college updates, deadlines, and offers.</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">3. Log Files</h2>
              <p>
                Compare Degree follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">4. Third-Party Privacy Policies</h2>
              <p>
                Compare Degree's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at info@comparedegree.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
