import {useEffect, useState} from "react";
import React from 'react';
import axios from 'axios';
import Buttons from "./Components/Buttons.jsx";
import {FaMapMarkerAlt , FaMapMarker} from "react-icons/fa";
import logo from "./assets/tw-dark-indigo-clean.png"


const App = () => {


    return (
        <>

            {/*navigation bar*/}
            <nav className="flex flex-row bg-darkerTransparentIndigoBlue space-y-1 border-b-2 border-gray-500 justify-between items-center">
                <div id="productName" className="flex flex-row p-3 ml-10 sm:text-2xl mb-0.5 items-center">
                    <a href="#" className="hover:ring-1 hover:ring-indigo-700 hover:rounded-full transition-all duration-300"> <img src={logo} alt="tune weather logo" className="size-14 mx-4 "/></a>
                    <h1 className="text-lg mx-4 font-extrabold sm:text-md sm:pt-1 md:text-xl lg:text-2xl"> <strong className="text-indigo-700">Tune</strong> <strong className="text-tuneWeatherCream font-bold">Weather</strong></h1>
                </div>

                {/*        username/loggedin status*/}
                <div className="flex flex-row  rounded-full items-center h-6 pb-1 mr-5">
                    <button id="userLoginStatus"
                        className="text-md text-center text-red-600 transition-all duration-200 hover:cursor-pointer hover:text-2xl hover:text-red-600 tracking-wider px-4 font-extrabold sm:text-sm md:text-lg lg:text-xl xl:text-xl">
                      <FaMapMarkerAlt></FaMapMarkerAlt>  </button>
                </div>
            </nav>

            {/*Hero*/}
            <div className=" flex flex-col bg-darkerTransparentIndigoBlue mx-auto w-full pb-20">
                <section id="hero" className="flex flex-col-reverse my-[8rem] mx-32">
                    <div id="headText" className="flex flex-col items-center justify-between rounded-2xl">
                        <h2 className="text-4xl text-left text-tuneWeatherCream font-extrabold sm:text-4xl md:text-5xl md:text-center lg:text-center xl:text-center xl:text-7xl">
                            Welcome to <strong className="text-indigo-700">Tune-Weather.</strong> A
                            product that lets <strong
                            className="text-indigo-700">nature</strong> decide what <strong className="text-indigo-700">tune</strong> you listen
                            to</h2>
                    </div>
                </section>

            <Buttons/>


            </div>
            {/*Location Dropdown*/}


            {/*footer*/}


        </>
    )
}

export default App;