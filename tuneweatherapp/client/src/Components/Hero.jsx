import React from 'react';
import IFrame from "./IFrame.jsx";
import Buttons from "./Buttons.jsx";

const Hero = ({mainHeaderHidden, iframeHidden, dashboardHeaderHidden, playlistSectionHeadersHidden, headerText, subHeaderHidden, pid}) => {
    return (
      <div>
        <div className=" flex flex-col bg-transparent mx-auto w-full">
          <section id="hero" className="flex flex-col-reverse my-[8rem] mx-32">
            <div
              id="headText"
              className="flex flex-col items-center justify-between rounded-2xl"
            >
              <div
                className={`${playlistSectionHeadersHidden ? "hidden" : ""} flex items-center flex-col mx-auto`}
              >
                <h2 className="-mt-20  text-4xl text-left text-tuneWeatherCream font-extrabold sm:text-4xl md:text-5xl md:text-center lg:text-center xl:text-center xl:text-7xl">
                  {headerText
                    ? "Here's your new playlist!"
                    : "Welcome! Click the button below to make your first playlist!"}
                </h2>
                <p
                  className={`${subHeaderHidden ? "hidden" : ""} text-center mb-6 mt-4 text-md text-gray-800`}
                >
                  The following playlist has been added to your spotify account
                </p>
              </div>
              <div className='md:p-2 lg:p-8 xl:p-28'>
                <h2
                    className={`${mainHeaderHidden ? "hidden" : ""} text-5xl text-left tracking-tight text-blacks font-extrabold sm:text-5xl md:text-6xl md:text-center lg:text-center xl:text-center xl:text-7xl`}
                >
                  Welcome to{" "}
                  <strong className="text-indigo-700">Tune-Weather.</strong> A
                  product that lets{" "}
                  <strong className="text-tuneWeatherCream">nature</strong> decide what{" "}
                  <strong className="text-tuneWeatherCream">tune</strong> you listen to
                </h2>
              </div>
              <h2
                  className={`${dashboardHeaderHidden ? "hidden" : ""} text-4xl text-left text-indigo-700 font-extrabold sm:text-4xl md:text-5xl md:text-center lg:text-center xl:text-center xl:text-7xl`}
              >
                Welcome!{" "}
              </h2>
              <IFrame hidden={iframeHidden} playlistId={pid}/>
            </div>
          </section>
        </div>
      </div>
    );
};

export default Hero;