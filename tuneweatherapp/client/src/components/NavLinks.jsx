import React from 'react';

const NavLinks = ({setCloseModal, clickHandler}) => {
    return (
        <>
            <div
                className="socialIcons  bg-gradient-to-r from-indigo-700 space-x-6 to-darkMagenta text-transparent bg-clip-text justify-end mr-2 hidden md:flex  invisible text-[0rem] md:visible sm:text-[0.66rem] md:text-[0.70rem] md:mr-8 lg:mr-8 xl:mr-10 xxl:mr-12 lg:text-[0.79rem]">
                <button
                    onClick={setCloseModal}
                    className="transition-all py-4 duration-100 hover:cursor-pointer focus:outline-none focus:border-b-4 border-darkMagenta px-4 "
                >
                    <h3>
                        {/*<FaEnvelope className="inline mr-2 mb-1" />*/}
                        Contact Us
                    </h3>
                </button>
                <a href='/'
                   className="p-0 transition-all py-4 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
                    <h3>
                        {/*<FaHouse className="inline mr-2 md:text-[0.8rem] lg:text-[0.89rem] mb-1" />*/}
                        Home
                    </h3>
                </a>
                <button
                    onClick={clickHandler}
                    className="p-0 transition-all py-4 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
                    <h3>
                        {/*<FaBook className="inline mr-2 mb-1" />*/}
                        Privacy Policy
                    </h3>
                </button>
                <a
                    href="https://github.com/speakerchef/tuneweatherapp"
                    className="p-0 transition-all py-4 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
                    <h3>
                        {/*<FaGithubSquare className="inline mr-2 mb-1" />*/}
                        GitHub
                    </h3>
                </a>
            </div>
        </>
    );
};

export default NavLinks;