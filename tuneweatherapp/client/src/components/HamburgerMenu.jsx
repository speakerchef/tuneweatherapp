import React from 'react';
import {FaBook, FaEnvelope, FaGithubSquare} from "react-icons/fa";
import {FaHouse} from "react-icons/fa6";

const HamburgerMenu = ({menuHidden, contactHandler, privacyHandler}) => {
    return (
        <>
            <div className={`md:hidden flex ${menuHidden && 'hidden'} flex-col top-0 justify-self-center absolute -auto z-20 shadow-2xl py-12 shadow-black mt-12 w-full h- bg-darkerTransparentIndigoBlue overflow-y-auto`}>
                <div className="bg-gradient-to-b flex flex-col items-center from-indigo-700 to-darkMagenta bg-clip-text text-transparent">
                    <button
                        onClick={contactHandler}
                        className="transition-all py-8 items-center duration-100 hover:cursor-pointer focus:outline-none focus:border-b-4 border-darkMagenta px-4 "
                    >
                        <h3>
                            <FaEnvelope className="text-indigo-700 inline mr-2 mb-1" />
                            Contact Us
                        </h3>
                    </button>
                    <a href='/'
                       className="p-0 transition-all py-8 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
                        <h3>
                            <FaHouse className="text-violet-800 inline mr-2 md:text-[0.8rem] lg:text-[0.89rem] mb-1" />
                            Home
                        </h3>
                    </a>
                    <button
                        onClick={privacyHandler}
                        className="p-0 transition-all py-8 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
                        <h3>
                            <FaBook className="text-purple-700 inline mr-2 mb-1" />
                            Privacy Policy
                        </h3>
                    </button>
                    <a
                        href="https://github.com/speakerchef/tuneweatherapp"
                        className="p-0 transition-all py-8 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
                        <h3>
                            <FaGithubSquare className="text-darkMagenta inline mr-2 mb-1" />
                            GitHub
                        </h3>
                    </a>
                </div>
            </div>
        </>
    );
};

export default HamburgerMenu;