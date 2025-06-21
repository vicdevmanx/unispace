import React from "react";
import AboutImage from "../assets/aboutImg.jpg";
import Navbar from './Navbar';
import { Users, Award, HeartHandshake, BookOpen } from 'lucide-react';


const About = () => {
  return (
    <>
      <Navbar />
      <section className="pt-20 bg-[#F9FAFB]">
        {/* Top Section: Title + Subtitle */}
        <div className="text-center bg-[#1D3A8A] text-white py-16 px-4">
          <h2 className="text-4xl font-bold mb-4">About UniSpace</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Revolutionizing workspace booking through community engagement,
            gamification, and smart technology solutions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl font-semibold text-[#111827] mb-6">
              Our Mission
            </h3>
            <p className="text-[#4B5563] mb-4 leading-relaxed">
              UniSpace was created to bridge the gap between workspace
              accessibility and community building. We believe that great work
              happens when talented individuals have access to inspiring spaces
              and meaningful connections.
            </p>
            <p className="text-[#4B5563] mb-6 leading-relaxed">
              Our platform serves university students, freelancers, and remote
              workers by providing not just workspace booking, but a complete
              ecosystem of support, mentoring, and rewards that foster growth and
              collaboration.
            </p>
            <button
              onClick={() => window.location.href = '/community'}
              className="inline-block bg-[#1D3A8A] text-white font-medium py-3 px-6 rounded-md shadow hover:bg-[#1d3a8acc] transition"
            >
              Join Our Community
            </button>
          </div>

          {/* Image */}
          <div className="w-full">
            <img
              src={AboutImage}
              alt="Community"
              className="rounded-lg shadow-md w-full object-cover"
            />
          </div>
        </div>

        {/* Example: Replace emoji icons with lucide-react icons in cards */}
        
        {/* You can continue replacing other icons in similar fashion throughout the project */}
      </section>
   
    </>
  );
};

export default About;
