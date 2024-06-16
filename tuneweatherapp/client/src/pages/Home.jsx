import React, {useState} from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";
import { FaSpotify, FaCloudRain, FaMusic } from "react-icons/fa6";
import bgImage from "../assets/bg.svg";
import PrivacyPolicy from "../Components/PrivacyPolicy.jsx";

const Home = () => {
    const [privacyHidden, setPrivacyHidden] = useState(true);
    function clickHandler() {
        setPrivacyHidden(!privacyHidden);
    }
    return (
      <>
        <div className="flex flex-col min-h-screen">
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
                  <div className="bg-gradient-to-r from-indigo-700 to-vibrantMagenta backdrop-filter backdrop-blur-lg shadow-lg text-center py-3 -mb-8 px-8 rounded-xl w-full">
                    <h3 className="text-3xl lg:text-4xl font-extrabold mt-0.5 text-black">
                      How it Works
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
                  <div className="relative text-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 text-[0.9rem] md:p-8 md:text-md lg:text-lg lg:p-10 rounded-2xl shadow-lg ">
                    <h3 className="text-xl pb-4 font-semibold text-white">
                      <FaSpotify className="text-black text-3xl" />
                    </h3>
                    <p className="text-gray-900">
                      Connect your Spotify Account
                    </p>
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

            {/*  disclaimer*/}

            <div className="text-center mt-6 mb-20 flex justify-center items-center">
              <div className="absolute mt-10 text-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg shadow-lg">
                <p className="text-black text-sm">
                  By clicking, you accept our{" "}
                  <button
                    className="text-indigo-700 hover:text-indigo-500 hover:underline"
                    onClick={() => setPrivacyHidden((prev) => !prev)}
                  >
                    privacy policy
                  </button>
                </p>
              </div>
            </div>
          </div>
            <PrivacyPolicy
                isHidden={privacyHidden}
                clickHandler={clickHandler}
            />
          <div className="flex-grow"></div>
          <footer className="bg-darkerTransparentIndigoBlue text-indigo-700 text-center text-[0.8rem] p-1 w-full mt-auto">
            <p>Copyright 2024 © All rights reserved - TuneWeather</p>
          </footer>
          {/*Spacer to push the boxes down*/}
        </div>
      </>
    );
};

export default Home;
