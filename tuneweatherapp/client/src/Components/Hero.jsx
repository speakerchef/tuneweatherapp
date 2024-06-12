import React from 'react';
import Buttons from "./Buttons.jsx";

const Hero = ({mainHeaderHidden, iframeHidden, dashboardHeaderHidden, playlistSectionHeadersHidden, headerText, subHeaderHidden, pid}) => {
  return (
      <div className="flex flex-col mt-12 bg-transparent mx-auto w-full px-4">
        <section id="hero" className="flex flex-col-reverse my-16 mx-auto">
          <div id="headText" className="flex flex-col items-center justify-between rounded-2xl">
            <div className={`${playlistSectionHeadersHidden ? "hidden" : ""} flex items-center flex-col mx-auto lg:mx-32 xl:mx-32`}>
              <h2 className="text-4xl text-center text-gray-800 font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl mx-4">
                {headerText ? "Here's your new playlist!" : "Welcome! Click the button below to make your first playlist!"}
              </h2>
              <p className={`${subHeaderHidden ? "hidden" : ""} text-center mb-5 mt-4 text-md text-gray-800 mx-4`}>
                The following playlist has been added to your Spotify account
              </p>
            </div>
            <div className="sm:mx-12 md:mx-8 lg:mx-12 mt-8 mb-12 xl:mx-24">
              <h2 className={`${mainHeaderHidden ? "hidden" : ""} text-5xl text-left tracking-tight text-gray-800 font-extrabold sm:text-5xl lg:mx-12 md:text-center md:text-6xl lg:text-center lg:text-6xl xl:text-center xl:text-7xl mx-4`}>
                Welcome to <strong className="text-indigo-700">Tune Weather.</strong> A product that lets <strong className="text-tuneWeatherCream">nature</strong> decide what <strong className="text-tuneWeatherCream">tune</strong> you listen to
              </h2>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Hero;