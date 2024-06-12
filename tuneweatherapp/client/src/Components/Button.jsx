import React, { useEffect, useState } from "react";
import Playlist from "../pages/Playlist.jsx";
export let sessionId;
import ErrorModal from "./ErrorModal.jsx";
import {FaSpotify} from "react-icons/fa6";
import {loginCondition as localLoginCondition} from "../pages/Playlist.jsx";

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

  useEffect(() => {
    const getUserLocation = async () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported");
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat.toString());
          setLongitude(lon.toString()),
            (err) => {
              console.log(err);
            };
        });
      }
    };

    getUserLocation().then(() => console.log("location retrieved"));
  }, [locationLoaded]);

  setTimeout(() => {
    setToggle((prev) => !prev);
  }, 5000);

  useEffect(() => {
    const sendUserLocation = async () => {
      if (latitude && longitude) {
        try {
          console.log(latitude, longitude);
          const res = await fetch(
              `https://tuneweatherapp.onrender.com/location?latitude=${latitude}&longitude=${longitude}`,
              {
                method: "POST",
              },
          );
          const data = await res.json();
          setApiData(await data.data.city)
        } catch (e) {
          console.log("Error sending location", e);
        } finally {
        }
      } else {
      }
    };

    // if (loginCondition) {
    //   console.log("User exists");
    //   window.location.replace('/playlist')
    // } else if (!loginCondition){
    //
    // }

    sendUserLocation().then(() => console.log("API DATA", apiData));
  }, [locationLoaded]);

  const login = async () => {
    setLocationLoaded(true)
      if (!loginCondition) {
        window.location.replace("https://tuneweatherapp.onrender.com/login");
        console.log("Location sent");
        setLoginCondition(true);
        setLoggedIn(true);
      } else {
        console.log("User exists")
      }
  };


  useEffect(() => {
    console.log("ITEM IN LOCAL STORAGE", localStorage.getItem("city"));
  }, [toggle]);

  return (
    <>
      {hasError && <ErrorModal />}
      <div className=" -translate-x-30 m-auto  ">
        {/*Button to link spotify*/}
        <div className="flex-col flex items-center ">
          <div className="text-center  ">
            <button
              onClick={login}
              className={`shadow-xl text-white -my-20 text-right text-lg bg-spotifyGreen py-3.5 md:-my-14 rounded-2xl hover:bg-green-600 transition-all duration-100 ease-in px-8 active:ring-1 active:ring-red-600 font-bold active:bg-darkerTransparentIndigoBlue sm:-my-14 md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:my-14 xl:py-5`}
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
