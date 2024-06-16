import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";
import Spinner from "../Components/Spinner.jsx";
import ErrorModal from "../Components/ErrorModal.jsx";
export let loginCondition = Boolean;
import { FaComputer } from "react-icons/fa6";

const Playlist = () => {
  const [getPlaylist, setGetPlaylist] = useState(15);
  const [headerText, setHeaderText] = useState(false);
  const [subHeaderHidden, setSubHeaderHidden] = useState(true);
  const [showIframe, setShowIframe] = useState(false);
  const [iFrame, setIFrame] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false)
  const [hasError, setHasError] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [apiData, setApiData] = useState('');


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

    getUserLocation().then(() => {
      if(latitude && longitude) {
        console.log("User coordinates retrieved")
      } else {
        console.log("User coordinates not retrieved");
      }
    });
  }, [locationLoaded]);


  useEffect(() => {
    const sendUserLocation = async () => {
      if (latitude && longitude) {
        try {
          console.log(latitude, longitude);
          const res = await fetch(
              `https://tuneweatherapp.onrender.com/location?latitude=${latitude}&longitude=${longitude}`,
              {
                method: "POST",
                credentials: 'include'
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

    sendUserLocation().then(() => {
      console.log("API DATA", apiData)
      setLocationLoaded(true)
    });
  }, [latitude, longitude]);

  useEffect(() => {
    setHeaderText(false);
    setSubHeaderHidden(false);
  }, [!hasError])

  const makePlaylist = async () => {};

  const clickHandler = async () => {
    setHeaderText(false)
    setSubHeaderHidden(false)
    let playlist_id = "";
    setLoading(true);
    setShowLoading(true);

      if (getPlaylist > 0) {
        setGetPlaylist((prev) => prev - 1);
        try {
          const response = await fetch(`https://tuneweatherapp.onrender.com/tracks` ,{
            method: 'GET',
            credentials: "include"
          });
          const data = await response.json();
          console.log("data from tracks endpoint", data);
          if (data.error) {
            if (data.error.status === 401){
              setErrorText("Your access has expired, please login again. Click OK to continue")
              setHasError(true)
              return
            }
            if (data.error.status === 429){
              setErrorText("You have made too many requests! Please try again after 1 minute. Click OK to continue");
              setHasError(true)
            }
            console.log("Something went wrong")
            console.log(data.error);
            loginCondition = false;
            setErrorText("There was an issue connecting your account. Please try again. Click OK to continue")
            setHasError(true);
            return;
          } else {
            playlist_id = data.data.playlist_id;
            console.log("playlist ID at else block",playlist_id)
            setIFrame(playlist_id)
            setSubHeaderHidden(false)
            setLoading(false)
            setSubHeaderHidden(false)
            setHeaderText(true)
            return
          }
        } catch (e) {
          setErrorText("Sorry, we were unable to create your playlist. Please try again")
          setHasError(true);
          console.log(e);
        } finally {
        }
      }
  };

  setInterval(() => {
    setGetPlaylist(15);
  }, 60000);

  return (
    <>
      <NavBar />
      <Hero
        mainHeaderHidden={true}
        dashboardHeaderHidden={true}
        headerText={headerText}
        subHeaderHidden={subHeaderHidden}
      />
      <div className="flex flex-col items-center -mt-44 justify-between rounded-2xl">
        {hasError && <ErrorModal errorText={errorText} />}
        { loading && showLoading ? (
          <Spinner />
        ) : !loading && (
          <div>
            <iframe
              src={`https://open.spotify.com/embed/playlist/${iFrame}?utm_source=generator&theme=0`}
              width="100%"
              // height="480px"
              // style={{display: "flex", flexDirection: 'column', minWidth: '768px', minHeight: '480px'}}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="flex min-h-[680px] min-w-[368px] -mb-12 sm:min-w-[480px] mt-20 sm:mt-20 md:mt-20 flex-col md:min-h-[768px] md:min-w-[768px] lg:min-h-[768px] lg:min-w-[1024px] xl:min-w-[1440px]"
            />
          </div>
        )}
      </div>

      <section id="hero" className="flex flex-col-reverse mx-16 mt-14 md:mt-12 mb-8">
        <div
          id="headText"
          className="flex flex-col items-center justify-between rounded-2xl"
        >
          <div className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 mt-4  rounded-lg shadow-lg">
            <p className="text-black">
              You can make another playlist. Please keep in mind, theres a limit
              of 15 playlists per minute! You have {getPlaylist} requests left
            </p>
          </div>
        </div>
      </section>
      <div className=" -translate-x-30 m-auto pb-20">
        {/*Button to link spotify*/}
        {locationLoaded && (<div className="flex-col mt-6 flex items-center text-center">
          <div className="text-center   ">
            <button
                onClick={clickHandler}
                className={`text-md bg-indigo-700 py-3.5 rounded-2xl hover:ring-1 hover:ring-indigo-700 hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-100 ease-in px-8 active:ring-1 active:ring-red-600 font-bold active:bg-darkerTransparentIndigoBlue md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5`}
            >
              Get Playlist
            </button>
          </div>
        </div>)}
      </div>
    </>
  );
};

export default Playlist;
