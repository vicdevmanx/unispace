import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import About from '../components/About'
import FAQ from '../components/Faq'
import Services from '../components/Services'
import { ContactUs } from '../components/ContactUs'
import Footer from '../components/Footer'
import { Toaster } from 'sonner' 

const LandingPage = () => {
  return (
    <div className="bg-[#1D3A8A]/5">
      <Toaster position="top-right" richColors /> 
          <Navbar />
          <HeroSection />
    
          <section id='about'>
            <About />
          </section>
    
          <section id='service'>
            <Services />
          </section>
    
          <section id='faq'>
            <FAQ />
          </section>
    
          <section id='contact'>
            <ContactUs />
          </section>
    
          <Footer />
        </div>
  )
}

export default LandingPage