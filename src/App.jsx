import FAQ from './components/Faq';
import Hero from './components/Hero';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div className="bg-[#1D3A8A]/10">
     <Navbar />
     <HeroSection/>
      <section id='faq'>
        <FAQ />
      </section>
    </div>
  );
}

export default App;