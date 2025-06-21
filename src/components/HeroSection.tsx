import React from 'react'

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-screen flex flex-col items-center justify-center text-white overflow-hidden font-[Poppins] bg-[#1B04BE]"
      style={{
        backgroundImage: 'url(/hero-section-image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* <div className="absolute inset-0 bg-blue-900/60 z-0" /> */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-4 text-center">
        <h1 className="text-[26px] xs:text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-tight drop-shadow-lg">
          Don't Just Book a Seat.<br />Earn. Connect. Grow.
        </h1>
        <p className="text-base xs:text-lg md:text-xl mb-6 md:mb-8 drop-shadow-md mx-auto max-w-xs sm:max-w-md md:max-w-2xl">
          UniSpace is your all-in-one platform for workspace booking, community, and rewards. Reserve your spot, connect with others, and unlock exclusive perks as you grow.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 md:mb-16 w-full max-w-xs sm:max-w-none mx-auto justify-center items-center">
          <a
            href="/register"
            className="bg-white text-[#214cc3] font-semibold px-6 py-3 md:px-8 md:py-3 rounded-xl shadow-lg hover:bg-blue-100 transition text-base md:text-lg w-full sm:w-auto"
          >
            Get Started
          </a>
          <a
            href="/#about"
            className="border-2 border-white text-white font-semibold px-6 py-3 md:px-8 md:py-3 rounded-xl hover:bg-white hover:text-[#214cc3] transition text-base md:text-lg w-full sm:w-auto"
          >
            Learn More
          </a>
        </div>
      </div>
      <a href='/#about' className="absolute bottom-4 md:bottom-8  -translate-x-1/2 flex flex-col items-center z-10 animate-bounce">
        <div className="w-6 h-8 md:w-8 md:h-12 border-2 border-white rounded-full flex items-center justify-center mb-1 md:mb-2">
          <span className="block w-1 h-2 md:h-3 bg-white"></span>
        </div>
        <span className="text-white text-sm md:text-base font-medium">Scroll down</span>
        <svg className="w-5 h-5 md:w-6 md:h-6 mt-1 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  )
}

export default HeroSection
