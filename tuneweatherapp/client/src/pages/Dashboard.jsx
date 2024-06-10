import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar.jsx";
import Hero from "../Components/Hero.jsx";
import Button from "../Components/Button.jsx";
import {redirect} from "react-router-dom";
import IFrame from "../Components/IFrame.jsx";

const Dashboard = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [getLocation, setGetLocation] = useState(false);
  const [getPlaylist, setGetPlaylist] = useState(false);

    const getUserLocation = async () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported");
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude),
            (err) => {
              console.log(err);
            };
        });
      }
    };

    const sendUserLocation = async () => {
      const res = await fetch(
        `http://localhost:5001/location?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "POST",
        },
      );
      const data = await res;
      return data;
    };

    const makePlaylist = async () => {
      if (getPlaylist) {
        try {
          await fetch('http://localhost:5001/tracks')
        }catch (e) {
          console.log(e);
          return <div className="grid w-full items-center rounded-2xl bg-tuneWeatherCream">
            <h2>Something went wrong</h2>
          </div>
        }
      }
    }

    const clickHandler = async () => {
        if (!getLocation){
            setGetLocation(true);
            getUserLocation().then(() =>
                sendUserLocation().then((r) => {
                    console.log(r);
                    setGetLocation(true);
                }),
            );
        }
        if (!getPlaylist){
            setGetPlaylist(true);
            await makePlaylist()
        }
        if (getLocation){
            window.location.replace('/playlist')
        }

    }

  return (
      <>
          <NavBar/>
          <Hero
              mainHeaderHidden={true}
              dashboardHeaderHidden={false}
              iframeHidden={true}
              playlistSectionHeadersHidden={true}
          />
          <section id="hero" className="flex flex-col-reverse mx-32">
              <div
                  id="headText"
                  className="flex flex-col items-center justify-between rounded-2xl"
              >
                  <div className={`flex items-center flex-col mx-auto`}>
                      <p className="text-center text-2xl -my-36 text-md text-gray-500">
                          Press the button below to create your first playlist!
                      </p>
                      <p></p>
                  </div>
              </div>
          </section>

          <div className=" -translate-x-30 m-auto ">
              <div className="flex-col flex items-center fle text-center">
                  <div className="text-center -my-14  ">
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

export default Dashboard;
