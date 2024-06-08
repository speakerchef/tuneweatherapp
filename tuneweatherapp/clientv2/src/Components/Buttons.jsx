import React, {useState, useEffect} from 'react';
import {location_api_key} from "../../../server/config.js";
import axios from "axios";

const Buttons = ({spotifyHidden}) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [apiData, setApiData] = useState([])
    const [location, setLocation] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [locationClicked, setLocationClicked] = useState(false)

    const login = async () => {
        window.location.href= 'http://localhost:5001/login'
    }

    useEffect(() => {
        const getUserLocation = async () => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported");
            } else {
                navigator.geolocation.getCurrentPosition((position) => {
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude),
                        err => {
                            console.log(err);
                        }
                })
            }
        }
        const reverseGeoUrl = `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&key=${location_api_key}`
        const userCity = fetch(reverseGeoUrl).then(res => res.json()).then(data => setLocation(data.city))

        getUserLocation()


    }, [locationClicked])

    const spotifyClickHandler = () => {
        setLocationClicked((prev) => !prev)
    }

    return (
        <div className=" -translate-x-30 m-auto ">

            {/*Button to link spotify*/}
            {!loggedIn && <div className="flex-col flex items-center fle text-center">
                <div className="text-center -my-14  ">
                    <button onClick={() => login()} id="spotifyButton"
                            className={`${spotifyHidden} text-md bg-indigo-600 text-darkerTransparentIndigoBlue py-3.5 rounded-2xl hover:ring-1 hover:ring-indigo-700 hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-100 ease-in px-8  font-bold active:bg-darkerTransparentIndigoBlue md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5`}>
                        Link Spotify
                    </button>
                </div>
            </div>}

            {/*Button to fetch songs*/}
            {loggedIn && <>
                <div className="flex flex-col items-center mx-auto fle text-center">
                    <div className=" text-center -my-14 ">
                        <button id="getsongs"
                                className="text-md bg-indigo-600 text-darkerTransparentIndigoBlue py-3.5 rounded-2xl hover:ring-1 hover:ring-indigo-700 hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-100 ease-in px-8  font-bold active:bg-darkerTransparentIndigoBlue md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5">
                            Get Tracks
                        </button>
                    </div>
                </div>
            </>}

        </div>
    );
};

export default Buttons;