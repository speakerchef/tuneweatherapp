import React, {useEffect, useState} from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";
import {sessionId} from "../Components/Button.jsx";
import Spinner from "../Components/Spinner.jsx";
import ErrorModal from "../Components/ErrorModal.jsx";


const Playlist = () => {
    const [getPlaylist, setGetPlaylist] = useState(15);
    const [headerText, setHeaderText] = useState(false);
    const [subHeaderHidden, setSubHeaderHidden] = useState(true);
    const [showIframe, setShowIframe] = useState(false);
    const [iFrame, setIFrame] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [toggle, setToggle] = useState(false);
    let playlist_id = ''


    const makePlaylist = async () => {
        let session_id;
        try {
            const response = await fetch('http://localhost:5001/playlist')
            const data = await response.json()
            session_id = data.data.session_id
        } catch (e) {
            setHasError(true)
            return
        }
        if (session_id) {
            try {
                const response = await fetch(`http://localhost:5001/tracks?session_id=${await session_id}`);
                const data = await response
                console.log("DATA", data)
                if (!data || data.error){
                    setHasError(true)
                    return
                }
                return await data
                // console.log(data);
            } catch (e) {
                setHasError(true)
                console.log(e);
            } finally {
                setLoading(false)
                setSubHeaderHidden(false)
            }
        }
    };

    const errorHandler = () => {
        window.location.replace('/home')
    }


    const clickHandler = async () => {
        setLoading(true)
        setHeaderText(true)
        setSubHeaderHidden(false)
        if (getPlaylist > 0) {
            setGetPlaylist((prev) => prev - 1)
            const pid = await makePlaylist()
            const data = (await pid).json()
            playlist_id = (await data).data.playlist_id
            console.log("Playlist data", playlist_id)
            if (playlist_id !== '') {
                setIFrame(
                    <div>
                        <iframe
                            src={`https://open.spotify.com/embed/playlist/${playlist_id}?utm_source=generator&theme=0`}
                            width="100%"
                            // height="480px"
                            // style={{display: "flex", flexDirection: 'column', minWidth: '768px', minHeight: '480px'}}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="flex min-h-[768px] min-w-[368px] flex-col md:min-h-[768px] md:min-w-[768px] lg:min-h-[768px] lg:min-w-[1024px]"
                        />
                    </div>)
                setShowIframe(true)
            }
        } else {

        }
    }

    setInterval(() => {
        setGetPlaylist(15);
    }, 60000)

    return (
        <>
            <NavBar/>
            <Hero
                mainHeaderHidden={true}
                dashboardHeaderHidden={true}
                headerText={headerText}
                subHeaderHidden={subHeaderHidden}
            />
            <div className="flex flex-col items-center -mt-48 justify-between rounded-2xl">
              {hasError && <ErrorModal />}
                {(loading && !hasError) ? <Spinner/> : iFrame}
            </div>

            <section id="hero" className="flex flex-col-reverse mx-32">
                <div
                    id="headText"
                    className="flex flex-col items-center justify-between rounded-2xl"
                >
                    <div className={`flex items-center mt-6 flex-col mx-auto`}>
                        <p className="text-center  text-md text-gray-500">
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
