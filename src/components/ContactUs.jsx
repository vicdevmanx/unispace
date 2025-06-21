import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
    // Handle actual submission here
  };

  return (
    <>
      <section className="text-center bg-[#1D3A8A] text-white py-28 lg:py-32 px-4 pb-10">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Get in touch with our team. We're here to help you make the most of your UniSpace experience.
        </p>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mail className="text-[#1D3A8A]" size={24} /> Send us a Message
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full border rounded px-4 py-2 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full border rounded px-4 py-2 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className={`w-full border rounded px-4 py-2 ${errors.subject ? 'border-red-500' : ''}`}
                  placeholder="What is this regarding?"
                  value={form.subject}
                  onChange={handleChange}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea
                  name="message"
                  className={`w-full border rounded px-4 py-2 min-h-[100px] ${errors.message ? 'border-red-500' : ''}`}
                  placeholder="Tell us more about your inquiry..."
                  value={form.message}
                  onChange={handleChange}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[#1D3A8A] text-white font-semibold py-3 rounded-xl mt-2 text-lg hover:bg-[#1D3A8A]/80 transition"
              >
                Send Message
              </button>
              {submitted && Object.keys(errors).length === 0 && (
                <p className="text-green-600 text-center mt-2">Message sent successfully!</p>
              )}
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
                <span className="bg-[#1D3A8A]/20 text-[#1D3A8A] p-3 rounded-lg"><Mail size={24} /></span>
                <div>
                  <div className="font-semibold">Email Us</div>
                  <div className="font-medium text-[#1D3A8A] break-all">info@unispace.com</div>
                  <div className="text-sm text-[#6B7280]">We respond within 24 hours</div>
                </div>
              </div>
              {/* Phone */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#1D3A8A]/20 text-[#1D3A8A] p-3 rounded-lg"><Phone size={24} /></span>
                <div>
                  <div className="font-semibold">Call Us</div>
                  <div className="font-medium text-[#1D3A8A] break-all">+1 (555) 123-4567</div>
                  <div className="text-sm text-[#6B7280]">Mon-Fri 9:00 AM - 6:00 PM EST</div>
                </div>
              </div>
              {/* Address */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#1D3A8A]/20 text-[#1D3A8A] p-3 rounded-lg"><MapPin size={24} /></span>
                <div>
                  <div className="font-semibold">Visit Us</div>
                  <div className="font-medium text-[#1D3A8A] break-all">123 Innovation Drive</div>
                  <div className="text-sm text-[#6B7280]">Tech Hub City, TC 12345</div>
                </div>
              </div>
              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow p-6 flex items-start gap-4 min-w-0">
                <span className="bg-[#1D3A8A]/20 text-[#1D3A8A] p-3 rounded-lg"><Clock size={24} /></span>
                <div>
                  <div className="font-semibold">Office Hours</div>
                  <div className="font-medium text-[#1D3A8A]">Monday - Friday</div>
                  <div className="text-sm text-[#6B7280]">9:00 AM - 6:00 PM EST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
