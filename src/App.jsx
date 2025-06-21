import Hero from './components/Hero'
import  Navbar from './components/Navbar'
import './index.css'

function App() {

  return (
    <div className="bg-[#1D3A8A]/10">
      <div className='pattern bg-[#1D3A8A]'>
        <Navbar/>
        <Hero />
      </div>
      
    </div>
  )
}

export default App
