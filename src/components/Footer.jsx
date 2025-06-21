import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-gradient-to-t from-[#1B04Be] to-[#1B04BE]">
      <footer className=" text-[#F3F4F6] pt-12 pb-6 px-4 mt-12">
        <div className="max-w-7xl  mx-auto justify-center grid grid-cols-1 md:grid-cols-4 gap-10 pb-8">
          {/* Brand & Social */}
          <div>
            <img src="/unispace_white_logo.svg" alt="Guru Innovation Hub" className="w-40 mb-4" />
            <p className="mb-6 text-[#D1D5DB]">A smart workspace booking platform that blends community engagement with gamification for students, freelancers, and remote workers.</p>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-[#1B04BE]" aria-label="Facebook"><Facebook size={22} /></a>
              <a href="#" className="hover:text-[#1B04BE]" aria-label="Twitter"><Twitter size={22} /></a>
              <a href="#" className="hover:text-[#1B04BE]" aria-label="Instagram"><Instagram size={22} /></a>
              <a href="#" className="hover:text-[#1B04BE]" aria-label="LinkedIn"><Linkedin size={22} /></a>
              <a href="#" className="hover:text-[#1B04BE]" aria-label="YouTube"><Youtube size={22} /></a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-[#1B04BE]">About Us</a></li>
              <li><a href="#courses" className="hover:text-[#1B04BE]">Services</a></li>
              <li><a href="#project-bank" className="hover:text-[#1B04BE]">Contributors</a></li>
              <li><a href="#faq" className="hover:text-[#1B04BE]">FAQ</a></li>
              <li><a href="#contact" className="hover:text-[#1B04BE]">Contact Us</a></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2 text-[#D1D5DB]">
              <li className="flex items-center"><Mail size={18} className="mr-2" /> guruIhub@gmail.com</li>
              <li className="flex items-center"><Phone size={18} className="mr-2" /> +234 (810) 525-25866</li>
              <li className="flex items-center"><MapPin size={18} className="mr-2" /> Calabar, Nigeria</li>
            </ul>
          </div>
          {/* Powered By */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold mb-4 text-white">Powered By</h3>
            <img src="/guruinnovationhub.png" alt="Guru Innovation Hub" className="w-40 mb-2" />
            
          </div>
        </div>
      </footer>
      <div className="border-t border-gray-400 py-4 px-4 flex flex-col md:flex-row justify-center space-x-2 items-center text-white/80 text-sm">
        <div>© 2024 UniSpace. All rights reserved</div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span>|</span>
          <span>developed by guru devs</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
