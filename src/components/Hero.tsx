import { Play } from 'lucide-react'
import React from 'react'

const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-4">
            <span className="items-center flex border-[1px] border-[#1D3A8A] p-1 rounded-lg text-[#1D3A8A] mb-3 text-sm md:text-base"><Play className='w-4 h-4' />
               <p> Playover a smarter way to work, connect, and grow.</p>
            </span>
            <h1 className="font-[600] leading-[1.2] text-[2rem] md:text-[3.5rem] text-center mb-2">
                Book Your Workspace, Earn Rewards,{' '}
                <span className="text-[#1d3a8a]">Build Community</span>
            </h1>
            <p className="text-base md:text-lg text-center mb-4">
                Your workspace, your community, your rewards
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-6 w-full md:w-auto justify-center items-center">
                <button className="bg-[#1D3A8A] text-white p-2 px-6 rounded-[0.5rem] shadow-lg w-full md:w-auto">
                    Get Started Now
                </button>
                <button className="w-full md:w-auto">Explore Features</button>
            </div>
        </div>
    )
}

export default Hero