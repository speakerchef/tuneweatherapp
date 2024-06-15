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
  const [hasError, setHasError] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [errorText, setErrorText] = useState("");
  let playlist_id = "";

  const makePlaylist = async () => {};

  const clickHandler = async () => {
    playlist_id = "";
    setLoading(true);
    setHeaderText(true);
    setSubHeaderHidden(false);
      if (getPlaylist > 0) {
        setGetPlaylist((prev) => prev - 1);
        try {
          const response = await fetch(`http://localhost:5001/tracks` ,{
            method: 'get',
            credentials: "include"
          });
          const data = await response.json();
          console.log("data from tracks endpoint", data);
          if (!data || data.error) {
            console.log(data.error);
            setErrorText(data.error);
            loginCondition = false;
            setHasError(true);
            return;
          } else {
            playlist_id = data.data.playlist_id;
            setSubHeaderHidden(false)
            return data.data.playlist_id;
          }
        } catch (e) {
          setHasError(true);
          console.log(e);
        } finally {
          setLoading(false);
        }
        console.log("Playlist data", playlist_id);
        if (playlist_id !== "") {
          setHasError(false);
          setShowIframe(true);
          setIFrame(playlist_id);
        } else {
          setErrorText(
              "Your access has expired. Please login again to continue using tuneweather. Click OK to return to the login page.",
          );
          setHasError(true);
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
        {loading || hasError ? (
          <Spinner />
        ) : (
          <div>
            <iframe
              src={`https://open.spotify.com/embed/playlist/${iFrame}?utm_source=generator&theme=0`}
              width="100%"
              // height="480px"
              // style={{display: "flex", flexDirection: 'column', minWidth: '768px', minHeight: '480px'}}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="flex min-h-[680px] min-w-[368px] mt-8 sm:mt-8 md:mt-8 flex-col md:min-h-[768px] md:min-w-[768px] lg:min-h-[768px] lg:min-w-[1024px] xl:min-w-[1440px]"
            />
          </div>
        )}
      </div>

      <section id="hero" className="flex flex-col-reverse mx-32">
        <div
          id="headText"
          className="flex flex-col items-center justify-between rounded-2xl"
        >
          <div className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 mt-4 -mb-2 rounded-lg shadow-lg">
            <p className="text-black">
              You can make another playlist. Please keep in mind, theres a limit
              of 15 playlists per minute! You have {getPlaylist} requests left
            </p>
          </div>
        </div>
      </section>
      <div className=" -translate-x-30 m-auto ">
        {/*Button to link spotify*/}
        <div className="flex-col mt-6 flex items-center text-center">
          <div className="text-center   ">
            <button
              onClick={clickHandler}
              className={`text-md bg-indigo-700 py-3.5 rounded-2xl hover:ring-1 hover:ring-indigo-700 hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-100 ease-in px-8 active:ring-1 active:ring-red-600 font-bold active:bg-darkerTransparentIndigoBlue md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5`}
            >
              Get Playlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Playlist;
