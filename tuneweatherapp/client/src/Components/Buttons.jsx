import React, {useState, useEffect} from 'react';

const Buttons = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <div className=" -translate-x-30 m-auto ">

            {/*Button to link spotify*/}
            {!loggedIn && <div className="flex-col flex items-center fle text-center">
                <div className=" text-center -my-14 ">
                    <button onClick={() => setLoggedIn((prev) => !prev)} id="spotifyButton"
                            className="bg-darkerTransparentIndigoBlue py-3.5 rounded-lg hover:rounded-3xl hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-200 ease-linear px-8 shadow-sm shadow-gray-600 font-bold text-white active:bg-darkerTransparentIndigoBlue">
                        Link Spotify
                    </button>
                </div>
            </div>}

            {/*Button to fetch songs*/}
            {loggedIn && <>
                <div className="flex flex-col items-center mx-auto fle text-center">
                    <div className=" text-center -my-14 ">
                        <button id="dropDown"
                                className="bg-gray-200 py-3.5 rounded-lg hover:rounded-3xl hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-200 ease-linear px-8 shadow-sm shadow-gray-600 font-bold text-white active:bg-darkerTransparentIndigoBlue">
                            Get Tracks
                        </button>
                    </div>
                </div>
            </>}

        </div>
    );
};

export default Buttons;