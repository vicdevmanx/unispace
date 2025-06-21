import About from './components/About';
import { ContactUs } from './components/ContactUs';
import FAQ from './components/Faq';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import Services from './components/services';
import './index.css';

function App() {
  return (
    <div className="bg-[#1D3A8A]/5">
     <Navbar />

     <HeroSection/>

     <section id='about'>
        <About />
      </section>

      <section id='service'>
        <Services />
      </section>

      <section id='faq'>
        <FAQ />
      </section>

      <section id='contac'>
        <ContactUs />
      </section>

      <Footer/>
    </div>
  );
}

export default App;