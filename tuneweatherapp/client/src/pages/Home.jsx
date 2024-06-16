import React from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";
import { FaSpotify, FaCloudRain, FaMusic } from "react-icons/fa6";
import bgImage from "../assets/bg.svg";

const Home = () => {
  return (
    <>
      <div className="relative grid w-full items-center">
        <NavBar />
        <Hero
          playlistSectionHeadersHidden={true}
          iframeHidden={true}
          dashboardHeaderHidden={true}
        />
        <div className="relative w-full px-4 my-16">
          <div className="relative h-auto -mt-20 sm:-mt-16 bg-gray-300 bg-opacity-[15%] backdrop-filter backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-lg mx-auto max-w-screen-xl">
            <div className="flex flex-col md:flex-row justify-center items-center md:space-x-6">
              <div className="bg-gradient-to-r from-indigo-700 to-vibrantMagenta backdrop-filter backdrop-blur-lg shadow-lg text-center py-4 -mb-8 px-8 rounded-xl w-full">
                <h3 className="text-3xl lg:text-4xl font-extrabold text-black">
                  How it Works
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
              <div className="relative text-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 text-[0.9rem] md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg ">
                <h3 className="text-xl pb-4 font-semibold text-white">
                  <FaSpotify className="text-black text-3xl" />
                </h3>
                <p className="text-gray-900">Connect your Spotify Account</p>
              </div>
              <div className="relative text-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-[0.9rem] p-6 md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg">
                <h3 className="text-xl pb-4 font-semibold text-white">
                  <FaCloudRain className="text-black text-3xl" />
                </h3>
                <p className="text-gray-900">
                  We analyze the weather at your location
                </p>
              </div>
              <div className="relative text-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-[0.9rem] p-6 md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg">
                <h3 className="text-xl pb-4 font-semibold text-white">
                  <FaMusic className="text-black text-3xl" />
                </h3>
                <p className="text-gray-900">
                  We deliver a curated playlist for you
                </p>
              </div>
            </div>
          </div>
        </div>
        <Button />
      </div>
      <div className="flex-grow"></div>
       Spacer to push the boxes down

      <footer className="bg-gray-900 text-white mt-28 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center">
            Have a question or issue?
          </h2>
          <p className="text-center mb-6">
            Send us a message and we'll get back to you as soon as possible.
          </p>
          <form className="max-w-lg mx-auto pb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                type="text"
                id="name"
                name="name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                type="email"
                id="email"
                name="email"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                id="message"
                name="message"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                className="bg-indigo-700 text-white px-4 py-2 font-bold rounded-xl hover:bg-green-600 transition duration-200"
                type="submit"
              >
                Send Message
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
