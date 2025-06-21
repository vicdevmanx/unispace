import  About  from './components/About'
import { ContactUs } from './components/ContactUs'
import  Navbar from './components/Navbar'
import './index.css'
import Footer from './components/Footer'

function App() {

  return (
    <div className="bg-[#1D3A8A]/10">
      <Navbar/>
      <About/>
      <ContactUs/>

    </div>
  )
}

export default App
