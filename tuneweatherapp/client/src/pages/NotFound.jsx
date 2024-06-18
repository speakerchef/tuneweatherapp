import React from 'react';
import Buttons from "../components/Buttons.jsx";
import NavBar from "../components/NavBar.jsx";
import robotImage from "../assets/robot-8189.svg"
import Footer from "../components/Footer.jsx";
import {ToastContainer} from "react-toastify";

const NotFound = () => {
    return (
        <>
            <ToastContainer/>
            <div className="flex flex-col min-h-screen">
            <NavBar/>
            <div>
                <div className=" flex flex-col bg-darkerTransparentIndigoBlue mx-auto w-full pb-20">
                    <section id="hero" className="flex flex-col-reverse my-[8rem] mx-32">
                        <div id="headText" className="flex flex-col items-center justify-center rounded-2xl">
                            <h2 className={` text-6xl text-center text-tuneWeatherCream font-extrabold sm:text-6xl md:text-7xl xl:text-9xl`}>
                                Error <strong className="text-customIndigo">404</strong>
                            </h2>
                            <h2 className={`mt-4 text-center text-4xl text-gray-500 font-extrabold sm:text-4xl md:text-5xl xl:text-7xl`}>
                                The page you're looking for does not exist!
                            </h2>
                        </div>
                    </section>
                    <div className="flex flex-col items-center">
                        <img src={robotImage}/>

                    </div>
                    {/*<Buttons/>*/}
                </div>
            </div>
            <Footer/>
            </div>
        </>
    );
};

export default NotFound;