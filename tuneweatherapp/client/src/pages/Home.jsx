import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";
import {FaComputer, FaMusic, FaCloud, FaC} from "react-icons/fa6";
import bgImage from "../assets/bg.svg";

const Home = () => {
  return (
      <>
        <div className="relative grid w-full items-center">
          <NavBar/>
          <Hero
              playlistSectionHeadersHidden={true}
              iframeHidden={true}
              dashboardHeaderHidden={true}
          />
          <Button/>
        </div>
        <div className="flex-grow"></div>
        {/* Spacer to push the boxes down */}
        <div className="relative pt-28 pb-64"> {/* Add padding to bottom */}
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                  className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg">
                <div className="tooltip absolute top-0 left-0 bg-gray-800 text-white text-sm rounded p-2 hidden">
                  Tooltip content 1
                </div>
                <h3 className="text-xl pb-4 font-semibold text-white"><FaComputer className="text-black text-3xl"/></h3>
                <p className="text-gray-900">Connect your Spotify Account</p>
              </div>
              <div
                  className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg">
                <div className="tooltip absolute top-0 left-0 bg-gray-800 text-white text-sm rounded p-2 hidden">
                  Tooltip content 2
                </div>
                <h3 className="text-xl pb-4 font-semibold text-white"><FaCloud className="text-black text-3xl"/></h3>
                <p className="text-gray-900">We analyze the weather at your location</p>
              </div>
              <div
                  className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg">
                <div className="tooltip absolute top-0 left-0 bg-gray-800 text-white text-sm rounded p-2 hidden">
                  Tooltip content 3
                </div>
                <h3 className="text-xl pb-4 font-semibold text-white"><FaMusic className="text-black text-3xl"/></h3>
                <p className="text-gray-900">We create and deliver a curated playlist for you</p>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-indigo-700 text-white py-8">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center">Have a question or issue?</h2>
            <p className="text-center mb-6">Send us a message and we'll get back to you as soon as possible.</p>
            <form className="max-w-lg mx-auto pb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
                <input
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="text" id="name" name="name" required/>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                <input
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="email" id="email" name="email" required/>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
                <textarea
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    id="message" name="message" rows="4" required></textarea>
              </div>
              <div className="text-center">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                    type="submit">Send Message
                </button>
              </div>
            </form>
          </div>
          <div className="text-center relative w-full pt-8 -mb-8 bg-black">
            <p className="text-[12px] font-thin -mt-5 text-white">
              Copyright &copy; 2024 TuneWeather: All rights reserved
            </p>
          </div>
        </footer>
      </>
  );
};

export default Home;
