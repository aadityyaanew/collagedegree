"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitCounsellingData } from "@/lib/leadService";

export default function ContactPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message"),
      answersSummary: "Source: Contact Us Page"
    };

    try {
      await submitCounsellingData(data);
      alert("Thank you for contacting us! We will get back to you shortly.");
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <div className="bg-navy text-white pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="container-main text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-lg text-slate-300">
              Have questions about an online degree? Need help choosing a university? Our expert counsellors are here to help.
            </p>
          </div>
        </div>

        <div className="container-main pb-16 sm:pb-20 -mt-10 sm:-mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">

            {/* Contact Info */}
            <div className="bg-crimson text-white p-6 sm:p-10 md:w-1/3 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">Contact Information</h3>
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-crimson-light shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Phone</p>
                      <p className="text-xs sm:text-sm text-crimson-100 mt-0.5 sm:mt-1">+91 8377959878</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-crimson-light shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Email</p>
                      <p className="text-xs sm:text-sm text-crimson-100 mt-0.5 sm:mt-1">info@comparedegree.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-crimson-light shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Office</p>
                      <p className="text-xs sm:text-sm text-crimson-100 mt-0.5 sm:mt-1">
                        Spectrum@Metro,Plot C & D Gardenia Gateway, Sector 75 , Noida -201316
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-6 sm:p-10 md:w-2/3">
              <h3 className="text-xl sm:text-2xl font-bold text-navy mb-5 sm:mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="+91"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Your Message</label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/20 resize-none"
                  ></textarea>
                </div>
                <Button type="submit" className="bg-crimson hover:bg-crimson-dark text-white rounded-lg px-8 h-12 w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
