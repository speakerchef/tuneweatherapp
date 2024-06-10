import React from 'react';
import IFrame from "./IFrame.jsx";
import Buttons from "./Buttons.jsx";

const Hero = ({mainHeaderHidden, iframeHidden, spotifyHidden, playlistSectionHeadersHidden}) => {
    return (
        <div>
            <div className=" flex flex-col bg-darkerTransparentIndigoBlue mx-auto w-full pb-20">
                <section id="hero" className="flex flex-col-reverse my-[8rem] mx-32">
                    <div id="headText" className="flex flex-col items-center justify-between rounded-2xl">
                        <div className={`hidden flex items-center flex-col mx-auto`}>
                            <h2 className="-mt-20  text-4xl text-left text-tuneWeatherCream font-extrabold sm:text-4xl md:text-5xl md:text-center lg:text-center xl:text-center xl:text-7xl">Here's
                                your new <strong className="text-indigo-700">playlist</strong></h2>
                            <p className="text-center mb-6 mt-4 text-md text-gray-500">The following playlist has been
                                added to your spotify account</p>
                        </div>
                        <IFrame hidden={"hidden"}/>
                        <h2 className={` text-4xl text-left text-tuneWeatherCream font-extrabold sm:text-4xl md:text-5xl md:text-center lg:text-center xl:text-center xl:text-7xl`}>
                            Welcome to <strong className="text-indigo-700">Tune-Weather.</strong> A
                            product that lets <strong
                            className="text-indigo-700">nature</strong> decide what <strong
                            className="text-indigo-700">tune</strong> you listen
                            to</h2>
                    </div>
                </section>

                <Buttons/>


            </div>
        </div>
    );
};

export default Hero;