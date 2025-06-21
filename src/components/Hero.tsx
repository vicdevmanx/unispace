import { Play } from 'lucide-react'
import React from 'react'
// import HeroCard from './HeroCard'

const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <span className="items-center rounded-full flex border-[1px] bg-[#e6edfa] border-[#1D3A8A] p-1 rounded-lg text-[#1D3A8A] mb-3 text-sm md:text-base">
                <span className='rounded-full p-1 bg-[#1D3A8A] text-white mr-1'>
                    <Play className='w-4 h-4' />
                </span>
                <p> Playover: a smarter way to work, connect, and grow.</p>
            </span>
            <h1 className="font-[600] text-white leading-[1.2] text-[2rem] md:text-[3.5rem] text-center mb-2">
                Book Your Workspace, Earn Rewards,{' '}
                <span className="text-[#4f7be7]">Build Community</span>
            </h1>
            <p className="text-[#b3c6f7] text-base md:text-lg text-center mb-4">
                Your workspace, your community, your rewards
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-6 w-full md:w-auto justify-center items-center">
                <button className="bg-[#4f7be7] hover:bg-[#214cc3] text-white p-2 px-6 rounded-[0.5rem] shadow-lg w-full md:w-auto transition">
                    Get Started Now
                </button>
                <button className="w-full md:w-auto border border-[#4f7be7] text-[#4f7be7] hover:bg-[#e6edfa] hover:text-[#1D3A8A] rounded-[0.5rem] p-2 px-6 transition">
                    Explore Features
                </button>
            </div>

            {/* <HeroCard /> */}
        </div>
    )
}

export default Hero