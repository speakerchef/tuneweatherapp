import React from "react";
import { FaCloudRain, FaMusic, FaSpotify } from "react-icons/fa6";
import {FaPlay} from "react-icons/fa";
import { PiPlaylistFill } from "react-icons/pi";


const HowItWorks = () => {
  return (
    <div className="relative w-full px-4  my-16">
      <div className="relative h-auto -mt-20 sm:-mt-16 bg-gray-200 bg-opacity-[15%] backdrop-filter backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-lg mx-auto max-w-screen-xl">
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-6">
          <div className="bg-gradient-to-r from-indigo-700 to-vibrantMagenta opacity-90 backdrop-filter backdrop-blur-lg shadow-lg text-center py-3 -mb-8 px-8 rounded-xl w-full">
            <h3 className="text-xl sm:text-2xl lg:text-4xl font-extrabold mt-0.5 text-black">
              How it Works
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="relative text-md sm:text-[1rem] bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 text-[0.9rem] md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg ">
            <h3 className="text-xl pb-4 font-semibold text-white">
              <FaSpotify className="text-black text-3xl" />
            </h3>
            <p className="text-gray-900">Connect your Spotify Account</p>
          </div>
          <div className="relative  sm:text-[1rem] text-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-[0.9rem] p-6 md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg">
            <h3 className="text-xl pb-4 font-semibold text-white">
              <FaCloudRain className="text-black text-3xl" />
            </h3>
            <p className="text-gray-900">
              We analyze the weather at your location
            </p>
          </div>
          <div className="relative sm:text-[1rem] text-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-[0.9rem] p-6 md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg">
            <h3 className="text-xl pb-4 font-semibold text-white">
              <PiPlaylistFill className="text-black -ml-0.5 text-[2rem]" />
            </h3>
            <p className="text-gray-900">
              We deliver a curated playlist for you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
