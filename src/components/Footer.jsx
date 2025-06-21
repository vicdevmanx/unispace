import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#18182F] text-[#F3F4F6] pt-12 pb-6 px-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#23234A] pb-8">
        {/* Brand & Social */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">UniSpace</h2>
          <p className="mb-6 text-[#D1D5DB]">A smart workspace booking platform that blends community engagement with gamification for students, freelancers, and remote workers.</p>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="hover:text-[#6C2BD7]" aria-label="Facebook"><Facebook size={22} /></a>
            <a href="#" className="hover:text-[#6C2BD7]" aria-label="Twitter"><Twitter size={22} /></a>
            <a href="#" className="hover:text-[#6C2BD7]" aria-label="Instagram"><Instagram size={22} /></a>
            <a href="#" className="hover:text-[#6C2BD7]" aria-label="LinkedIn"><Linkedin size={22} /></a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#about" className="hover:text-[#6C2BD7]">About Us</a></li>
            <li><a href="#services" className="hover:text-[#6C2BD7]">Services</a></li>
            <li><a href="#contributors" className="hover:text-[#6C2BD7]">Contributors</a></li>
            <li><a href="#faq" className="hover:text-[#6C2BD7]">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#6C2BD7]">Contact</a></li>
          </ul>
        </div>
        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
          <ul className="space-y-2">
            <li>Workspace Booking</li>
            <li>Community Engagement</li>
            <li>Mentoring Program</li>
            <li>Gamification Rewards</li>
             <li>Referral Program</li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
          <ul className="space-y-2 text-[#D1D5DB]">
            <li className="flex items-center"><Mail size={18} className="mr-2" /> info@unispace.com</li>
            <li className="flex items-center"><Phone size={18} className="mr-2" /> +1 (555) 123-4567</li>
            <li className="flex items-center"><MapPin size={18} className="mr-2" /> 123 Innovation Drive<br />Tech Hub City, TC 12345</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-6 text-[#A1A1AA] text-sm">
        <div>© 2024 UniSpace. All rights reserved.</div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#6C2BD7]">Privacy Policy</a>
          <a href="#" className="hover:text-[#6C2BD7]">Terms of Service</a>
          <a href="#" className="hover:text-[#6C2BD7]">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
