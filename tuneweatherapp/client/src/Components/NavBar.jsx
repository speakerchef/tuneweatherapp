import React from 'react';
import {FaMapMarkerAlt} from "react-icons/fa";

const NavBar = () => {
    return (
        <>
            {/*navigation bar*/}
            <nav className="flex flex-row bg-darkerTransparentIndigoBlue space-y-1 border-b-2 border-gray-500 justify-between items-center">
                <div id="productName" className="flex flex-row p-3 ml-10 sm:text-2xl mb-0.5 items-center">
                    {/*<a href="#" className="hover:ring-1 hover:ring-indigo-700 hover:rounded-full transition-all duration-300"> <img src={logo} alt="tune weather logo" className="size-14 mx-4 "/></a>*/}
                    <a href='/dashboard' className="text-lg mx-4 hover:ring-1 hover:ring-indigo-700 hover:px-1.5 hover:cursor-pointer hover:rounded-full transition-all duration-300 font-extrabold sm:text-md sm:pt-1 md:text-xl lg:text-2xl"> <strong className="text-indigo-700">Tune</strong> <strong className="text-tuneWeatherCream font-bold">Weather</strong></a>
                </div>

                {/*        username/loggedin status*/}
                <div className="flex flex-row  rounded-full items-center h-6 pb-1 mr-5">
                    <button id="userLoginStatus"
                            className="text-md text-center text-red-600 transition-all duration-200 hover:cursor-pointer hover:text-2xl hover:text-red-600 tracking-wider px-4 font-extrabold sm:text-sm md:text-lg lg:text-xl xl:text-xl">
                        <FaMapMarkerAlt></FaMapMarkerAlt>  </button>
                </div>
            </nav>
        </>
    );
};

export default NavBar;