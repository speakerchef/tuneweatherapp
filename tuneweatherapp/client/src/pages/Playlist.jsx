import React, { useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import NavBar from "../components/NavBar.jsx";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorModal from "../components/ErrorModal.jsx";

export let loginCondition;
import { FaComputer } from "react-icons/fa6";
import Footer from "../components/Footer.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "tailwindcss/defaultTheme.js";

const Playlist = () => {
  const [getPlaylist, setGetPlaylist] = useState(5);
  const [headerText, setHeaderText] = useState(false);
  const [subHeaderHidden, setSubHeaderHidden] = useState(true);
  const [showIframe, setShowIframe] = useState(false);
  const [iFrame, setIFrame] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [apiData, setApiData] = useState("");
  const [errorLocation, setErrorLocation] = useState(false);

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
      if (latitude && longitude) {
        console.log("User coordinates retrieved");
      } else {
        console.error("User coordinates not retrieved");
      }
    });
  }, [locationLoaded]);

  useEffect(() => {
    const sendUserLocation = async () => {
      if (latitude && longitude) {
        try {
          console.log(latitude, longitude);
          const res = await fetch(
            `https://api.tuneweather.com/location?latitude=${latitude}&longitude=${longitude}`,
            {
              method: "POST",
              credentials: "include",
            },
          );
          const data = await res.json();
          setApiData(await data.data.city);
        } catch (e) {
          toast.error(
            "We could not get your location. Please reload the page or enable location access.",
            {
              theme: "dark",
            },
          );
          console.error("Error sending location", e);
        } finally {
        }
      } else {
      }
    };

    sendUserLocation()
      .then(() => {
        console.log("API DATA", apiData);
      })
      .catch((e) => {
        console.error(e);
      });
    if (latitude && longitude) {
      setLocationLoaded(true);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    setHeaderText(false);
    setSubHeaderHidden(false);
  }, [!hasError]);

  useEffect(() => {}, []);

  const clickHandler = async () => {
    setHeaderText(false);
    setSubHeaderHidden(false);
    let playlist_id = "";
    setLoading(true);
    setShowLoading(true);

    if (getPlaylist > 0) {
      setGetPlaylist((prev) => prev - 1);
      try {
        const response = await fetch(`https://api.tuneweather.com/tracks`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Main response", data);
        if (data.error) {
          if (data.error.status === 401) {
            setErrorText(
              "Your access has expired, please login again. Click OK to continue",
            );
            loginCondition = false;
            setHasError(true);
            return;
          }
          if (data.error.status === 429) {
            setErrorText(
              "You have made too many requests! Please try again after 1 minute. Click OK to continue",
            );
            setHasError(true);
          }
          console.error("Something went wrong");
          console.log(data.error);
          loginCondition = false;
          setErrorText(
            "There was an issue connecting your account. Please try again. Click OK to continue",
          );
          setHasError(true);
        } else {
          playlist_id = data.data.playlist_id;
          if (!playlist_id) {
            toast.info(
              "If the preview does not load, please consider trying again after disabling adblock or other extreme privacy features.",
              {
                delay: 7000,
              },
            );
          }
          console.log("playlist ID", playlist_id);
          toast.success("Playlist created!");
          setIFrame(playlist_id);
          setSubHeaderHidden(false);
          setLoading(false);
          setSubHeaderHidden(false);
          setHeaderText(true);
        }
      } catch (e) {
        setErrorText(
          "Sorry, we were unable to create your playlist. Please try again later.",
        );
        setHasError(true);
        console.log(e);
      } finally {
      }
    }
  };

  setInterval(() => {
    setGetPlaylist(5);
  }, 60000);

  return (
    <>
      <ToastContainer
      theme="dark"/>

      <div className="flex flex-col min-h-screen">
        <NavBar isLoggedIn={loginCondition} />
        {hasError && <ErrorModal errorText={errorText} />}
        <div className="bg-translucentDarkerTransparentIndigoBlue contain-content shadow-md shadow-gray-950 m-8 backdrop-filter backdrop-blur-lg rounded-2xl">
          <Hero
            mainHeaderHidden={true}
            dashboardHeaderHidden={true}
            headerText={headerText}
            subHeaderHidden={subHeaderHidden}
          />
          <div className="flex flex-col items-center -mt-44 justify-between rounded-2xl">

            {loading && showLoading ? (
              <Spinner />
            ) : !loading && (
              (
                <div className="flex items-center justify-center">
                  <iframe
                    src={`https://open.spotify.com/embed/playlist/${iFrame}?utm_source=generator&theme=0`}
                    width="100%"
                    // height="480px"
                    // style={{display: "flex", flexDirection: 'column', minWidth: '768px', minHeight: '480px'}}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="flex min-h-[680px] contain-content min-w-screen px-4  md:min-w-[680px] sm:min-w-[400px] -mb-12  mt-16 sm:mt-16 md:mt-10 flex-col md:min-h-[768px] lg:min-h-[768px] lg:min-w-[880px] xl:min-w-[1280px]"
                  />
                </div>
              )
            )}
          </div>

          <section
            id="hero"
            className="flex flex-col-reverse mx-16 mt-14 md:mt-12 mb-8"
          >
            <div
              id="headText"
              className="flex flex-col items-center justify-between rounded-2xl"
            >
              <div className="relative bg-black bg-opacity-0 backdrop-filter backdrop-blur-lg p-4 mt-4  rounded-lg shadow-lg">
                <p className="text-indigo-700">
                  You can make more playlists. There is a limit of 5 playlists
                  per minute! You have {getPlaylist}{" "}
                  {getPlaylist !== 1 ? "playlists" : "playlist"} left.
                </p>
              </div>
            </div>
          </section>
          <div className=" -translate-x-30 ">
            {/*Button to link spotify*/}
            {!locationLoaded ? (
              <div className="text-center">
                <h3 className="animate-pulse mb-10 bg-gradient-to-r from-indigo-700 to-vibrantMagenta bg-clip-text text-transparent">
                  Getting your location...
                </h3>
              </div>
            ) : (
              <div className="flex-col my-6 mb-16 flex  text-center">
                <div className="text-center   ">
                  <button
                    onClick={clickHandler}
                    className={`text-md shadow-md  bg-indigo-700 py-3.5 rounded-xl hover:bg-indigo-600 transition-all duration-100 ease-in px-8 active:bg-indigo-900 active:ring-indigo-700 font-bold md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5`}
                  >
                    Get Playlist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Playlist;
