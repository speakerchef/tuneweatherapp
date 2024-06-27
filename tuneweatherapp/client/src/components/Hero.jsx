import React from 'react';
import Buttons from "./Buttons.jsx";

const Hero = ({mainHeaderHidden, iframeHidden, dashboardHeaderHidden, playlistSectionHeadersHidden, headerText, subHeaderHidden, pid}) => {
  return (
      <div className="flex  flex-col mt-12 bg-transparent mx-auto w-full px-4 overflow-x-hidden">
        <section id="hero" className="flex flex-col-reverse my-16 mx-auto">
          <div id="headText" className="flex flex-col items-center justify-between rounded-2xl -my-8 md:-my-4">
            <div className={`${playlistSectionHeadersHidden ? "hidden" : ""}  sm:mx-12 md:mx-8 lg:mx-12 mt-8 mb-16 xl:mx-242`}>
              <h2 className="text-5xl   font-extrabold bg-gradient-to-br from-lightMagenta to-indigo-700 bg-clip-text text-transparent opacity-85 -my-14 pb-1 sm:-mx-4 sm:text-5xl slg:text-7xl lg:text-7xl lg:mx-7 md:text-center md:text-6xl lg:text-center xl:text-center xl:text-7xl xxl:text-[5rem] mx-4">
                {headerText ? "Here's your new playlist!" : "Welcome, click the button below to make your first playlist!"}
              </h2>
              <p className={`${!subHeaderHidden && "hidden"} text-center mb-5 mt-4 text-md text-gray-800 mx-4`}>
                The following playlist has been added to your Spotify account
              </p>
            </div>
            <div className="sm:mx-12 md:mx-8 lg:mx-12 mt-8 mb-12 xl:mx-24">
              <h2 className={`${mainHeaderHidden ? "hidden" : ""} text-5xl -mt-14 -mb-8 text-left tracking-tight text-tuneWeatherCream font-extrabold sm:-mx-4 sm:text-5xl slg:text-7xl lg:text-7xl lg:mx-7 md:text-center md:text-6xl lg:text-center xl:text-center xl:text-7xl xxl:text-8xl mx-4`}>
                Welcome to <strong className="bg-gradient-to-r from-vibrantMagenta to-indigo-700 text-transparent opacity-90 bg-clip-text">Tune Weather.</strong> A product that lets <strong className="text-indigo-700">nature</strong> decide what <strong className="text-darkMagenta">tune</strong> you listen to
              </h2>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Hero;