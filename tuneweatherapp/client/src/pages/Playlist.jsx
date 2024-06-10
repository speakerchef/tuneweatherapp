import React, { useEffect, useState } from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";

const Playlist = () => {
  const [getPlaylist, setGetPlaylist] = useState(15);
  const [headerText, setHeaderText] = useState(false);
  const [subHeaderHidden, setSubHeaderHidden] = useState(true);
  const [iFrameHidden, setIFrameHidden] = useState(true);
  let pid;
  const makePlaylist = async () => {
    try {
      await fetch("http://localhost:5001/tracks");
    } catch (e) {
      console.log(e);

    }
  };

  const clickHandler = async () => {
    setHeaderText(true)
    setSubHeaderHidden(false)
    setIFrameHidden(false)
    if (getPlaylist > 0) {
      setGetPlaylist((prev) => prev-1)
      pid = await makePlaylist();
    } else {

    }
  }

  setInterval(() => {
    setGetPlaylist(15);
  }, 60000)



  return (
    <>
      <NavBar />
      <Hero iframeHidden={iFrameHidden}  mainHeaderHidden={true} dashboardHeaderHidden={true} headerText={headerText} subHeaderHidden={subHeaderHidden} pid={pid && pid} />
      <section id="hero" className="flex flex-col-reverse mx-32">
        <div
          id="headText"
          className="flex flex-col items-center justify-between rounded-2xl"
        >
          <div className={`flex items-center flex-col mx-auto`}>
            <p className="text-center -my-36 text-md text-gray-500">
              You can make another playlist. Please keep in mind, theres a limit
              of 15 playlists per minute! You have {getPlaylist} requests left
            </p>
            <p></p>
          </div>
        </div>
      </section>
      <div className=" -translate-x-30 m-auto ">
        {/*Button to link spotify*/}
        <div className="flex-col flex items-center fle text-center">
          <div className="text-center -my-20  ">
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
