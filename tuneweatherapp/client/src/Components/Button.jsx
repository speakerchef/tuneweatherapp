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
              `http://localhost:5001/location?latitude=${latitude}&longitude=${longitude}`,
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
        window.location.replace("http://localhost:5001/login");
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
        <div className="flex justify-center mt-8">
          {/*Button to link spotify*/}
          <button
              onClick={login}
              className="shadow-xl text-white text-lg mb-14 font-bold bg-spotifyGreen py-3.5 rounded-2xl hover:bg-green-600 transition-all duration-100 ease-in px-6 md:px-8 md:py-4 lg:px-8 lg:py-4 xl:px-8 xl:py-4"
          >
            <FaSpotify className="inline mr-2 mb-1" />
            {buttonText}
          </button>
        </div>
      </>
  );
};

export default Button;