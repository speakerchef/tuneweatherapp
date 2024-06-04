import React, {useState, useEffect} from 'react';

const Buttons = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div className=" -translate-x-30 m-auto ">

            {/*Button to link spotify*/}
            <div className="flex-col flex  items-center fle text-center">
                <div className=" text-center  -my-7 rounded-lg">
                    <button id="dropDown"
                            className="bg-spotifyGreen py-4 px-8 shadow-sm shadow-gray-600 font-bold text-white rounded-full hover:bg-transparentIndigoBlue hover:text-indigo-700 trans duration-100 active:bg-darkerTransparentIndigoBlue">
                        Link Spotify
                    </button>
                </div>
            </div>

            {/*Button to fetch songs*/}
            <div className="flex flex-col items-center mx-auto fle text-center">
                <div className=" text-center -my-7 rounded-lg">
                    <button id="dropDown"
                            className="bg-gray-200 py-4 px-8 shadow-sm shadow-gray-600 font-bold text-indigo-700 rounded-full hover:bg-transparentIndigoBlue hover:text-indigo-700 trans duration-100 active:bg-darkerTransparentIndigoBlue">
                        Get Tracks
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Buttons;