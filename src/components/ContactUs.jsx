import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactUs = () => {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="bg-[#1D3A8A] py-20 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Get in touch with our team. We're here to help you make the most of your UniSpace experience.
        </p>
      </section>

      {/* Main Contact Section */}
      <section className="bg-[#F9FAFB] py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="text-[#6C2BD7]" size={24} /> Send us a Message
            </h2>
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Full Name</label>
                  <input type="text" className="w-full border rounded px-4 py-2" placeholder="Enter your full name" />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Email Address</label>
                  <input type="email" className="w-full border rounded px-4 py-2" placeholder="Enter your email" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Subject</label>
                <input type="text" className="w-full border rounded px-4 py-2" placeholder="What is this regarding?" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea className="w-full border rounded px-4 py-2 min-h-[100px]" placeholder="Tell us more about your inquiry..." />
              </div>
              <button type="submit" className="w-full bg-[#3B0CA8] text-white font-semibold py-3 rounded mt-2 text-lg hover:bg-[#4B1FCF] transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div>
            <div
              className="
                grid grid-cols-1
                sm:grid-cols-2
                gap-6 mb-8
                md:grid-cols-2
                lg:grid-cols-2
                xl:grid-cols-2
                "
            >
              {/* Email */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#EDE9FE] text-[#6C2BD7] p-3 rounded-lg"><Mail size={24} /></span>
                <div>
                  <div className="font-semibold">Email Us</div>
                  <div className="font-medium text-[#6C2BD7] break-all">info@unispace.com</div>
                  <div className="text-sm text-[#6B7280]">We respond within 24 hours</div>
                </div>
              </div>
              {/* Phone */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#EDE9FE] text-[#6C2BD7] p-3 rounded-lg"><Phone size={24} /></span>
                <div>
                  <div className="font-semibold">Call Us</div>
                  <div className="font-medium text-[#6C2BD7] break-all">+1 (555) 123-4567</div>
                  <div className="text-sm text-[#6B7280]">Mon-Fri 9:00 AM - 6:00 PM EST</div>
                </div>
              </div>
              {/* Address */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#EDE9FE] text-[#6C2BD7] p-3 rounded-lg"><MapPin size={24} /></span>
                <div>
                  <div className="font-semibold">Visit Us</div>
                  <div className="font-medium text-[#6C2BD7] break-all">123 Innovation Drive</div>
                  <div className="text-sm text-[#6B7280]">Tech Hub City, TC 12345</div>
                </div>
              </div>
              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#EDE9FE] text-[#6C2BD7] p-3 rounded-lg"><Clock size={24} /></span>
                <div>
                  <div className="font-semibold">Office Hours</div>
                  <div className="font-medium text-[#6C2BD7]">Monday - Friday</div>
                  <div className="text-sm text-[#6B7280]">9:00 AM - 6:00 PM EST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};
