import HeroSection from './components/HeroSection'
import  Navbar from './components/Navbar'
import './index.css'
import Footer from './components/Footer'
import About from './components/About'
import { ContactUs } from './components/ContactUs'

function App() {

  return (
    <div className="bg-[#1D3A8A]/10">
      <Navbar/>
      <HeroSection/>
      <About/>
      <ContactUs/>
    </div>
  )
}

export default App
