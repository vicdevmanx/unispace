import FAQ from './components/Faq';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div className="bg-[#1D3A8A]/10 min-h-screen relative">
      <div className="pattern bg-[#1D3A8A] pt-16 pb-40">
        <Navbar />
        <Hero />
      </div>

      
      <section id='faq'>
        <FAQ />
      </section>
    </div>
  );
}

export default App;