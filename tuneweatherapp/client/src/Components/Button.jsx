"use strict";
import React, { useEffect, useState } from "react";
import ErrorModal from "./ErrorModal.jsx";
import {FaSpotify} from "react-icons/fa6";
import {loginCondition as localLoginCondition} from "../pages/Playlist.jsx";
import Playlist from "../pages/Playlist.jsx"

// Button component
const Button = ({ buttonText = "Link Spotify"}) => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [apiData, setApiData] = useState('');
    const [loginCondition, setLoginCondition] = useState(localLoginCondition);
    // useEffect(() => {
    //   const getUserLocation = async () => {
    //     if (!navigator.geolocation) {
    //       alert("Geolocation is not supported");
    //     } else {
    //       navigator.geolocation.getCurrentPosition((position) => {
    //         const lat = position.coords.latitude;
    //         const lon = position.coords.longitude;
    //         setLatitude(lat.toString());
    //         setLongitude(lon.toString()),
    //           (err) => {
    //             console.log(err);
    //           };
    //       });
    //     }
    //   };
    //
    //   getUserLocation().then(() => {
    //     if(latitude && longitude) {
    //       console.log("User coordinates retrieved")
    //     } else {
    //       console.log("User coordinates not retrieved");
    //     }
    //   });
    // }, [locationLoaded]);
    //
    // setTimeout(() => {
    //   setToggle((prev) => !prev);
    // }, 5000);
    //
    // useEffect(() => {
    //   const sendUserLocation = async () => {
    //     if (latitude && longitude) {
    //       try {
    //         console.log(latitude, longitude);
    //         const res = await fetch(
    //             `https://082c-2001-56a-fa78-8200-c05c-1383-bcf8-a344.ngrok-free.app/location?latitude=${latitude}&longitude=${longitude}`,
    //             {
    //               method: "POST",
    //               credentials: 'include'
    //             },
    //         );
    //         const data = await res.json();
    //         setApiData(await data.data.city)
    //       } catch (e) {
    //         console.log("Error sending location", e);
    //       } finally {
    //       }
    //     } else {
    //     }
    //   };
    //
    //   sendUserLocation().then(() => console.log("API DATA", apiData));
    // }, [latitude, longitude]);

    const login = async () => {
        // setLocationLoaded(prev => !prev)
        if (!loginCondition) {
            try {
                const response = await fetch('https://api.tuneweather.com/login', {
                    method: "POST",
                    credentials: "include",
                })
                const data = await response.json()
                console.log(data)
                if (data.error){
                    setHasError(true)
                }
                if (data && data.data && data.data.status){
                    if (data.data.status === 200){
                        console.log("Return status", data.data.status)
                        window.location.replace('https://tuneweather.com/playlist')
                        return
                    }
                    return
                }
                console.log(data)
                const redirectUrl = data.redirectLink
                console.log("redirect URL",redirectUrl)
                window.location.href = redirectUrl



                setLoginCondition(true);
                setLoggedIn(true);

            } catch (e) {
                console.log("Error logging in", e);
            }
            // console.log("Location sent");

        } else {
            console.log("User exists")
            window.location.href = '/playlist'
        }
    };


    return (
        <>
            {hasError && <ErrorModal />}
            <div className=" -translate-x-30 m-auto mt-8 ">
                {/*Button to link spotify*/}
                <div className="flex-col flex items-center ">
                    <div className="text-center  ">
                        <button
                            onClick={login}
                            className={`shadow-lg text-black -my-20 text-right  text-xl bg-spotifyGreen py-3.5 md:-my-14 rounded-xl hover:bg-green-600 transition-all duration-100 ease-in px-8 font-bold active:bg-green-900 sm:-my-14 md:text-lg lg:text-xl xl:text-2xl lg:px-8 lg:py-4 xl:px-8 xl:-mb-4 xl:py-6`}
                        >
                            <FaSpotify className="inline -mt-0.5 mr-1" />     Link Spotify
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Button;
