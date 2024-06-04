import {useEffect, useState} from "react";
import React from 'react';
import axios from 'axios';

const App = () => {
    const [apiData, setApiData] = useState([])


    useEffect(() => {
        const getData = async() => {
            const res = await axios.get('http://localhost:5001/get-tracks')
            const data = await res.data["tracks"]
            setApiData(data)
        }

        getData()
    }, [])

    console.log(apiData)

    return (
        <>

            <div className="flex flex-col ">
                {/*navigation bar*/}
                <nav className="flex flex-row bg-indigo-700 justify-between px-4 items-center">
                    <div id="productName" className="flex flex-row p-4 ml-7 mt-5
                     sm:text-2xl mb-0.5">
                        <h1 className="text-xl text-white font-extrabold md:text-2xl lg:text-2xl">
                            <strong className="text-[#030d15]">Tune</strong> <strong
                            className="text-white">Weather</strong></h1>
                    </div>

                    {/*username/loggedin status*/}
                    <div className="flex rounded-full items-center h-12 pr-1 mr-7">
                        <h2 id="userLoginStatus"
                            className="text-md text-center text-[#030d15] tracking-wider px-4 font-extrabold sm:text-sm md:text-md lg:text-md xl:text-xl">
                            username</h2>
                    </div>
                </nav>
                {/*<div className="flex bg-gray-100 border-2 border-white my-auto"></div>*/}
                {/*Hero*/}
                <div className="flex flex-col m-auto">
                    <section id="hero" className="flex bg-indigo-700 relative flex-col-reverse mx-auto p-6">
                        <div id="headText" className="text-center p-6">
                            <h2 className="text-white  text-3xl font-extrabold leading-tight justify-center relative md:text-5xl">
                                Welcome to <strong className="text-darkerTransparentIndigoBlue">Tune-Weather.</strong> A
                                product that lets <strong
                                className="text-darkerTransparentIndigoBlue">nature</strong> decide what you listen to
                                <strong className="text-darkerTransparentIndigoBlue"> . . .</strong></h2>
                        </div>
                    </section>


                </div>
            </div>

            {/*Spotify link button*/}


            {/*Button to fetch songs*/}
            <div className="flex-row place-items-center">
                <div className="text-center py-4 rounded-lg px-6 mt-5">
                    <button className="bg-green-500 px-6 py-4 font-bold text-white rounded-full shadow-amber-300 hover:bg-transparentIndigoBlue hover:text-indigo-700 trans duration-100 active:bg-darkerTransparentIndigoBlue">
                        Connect Spotify
                    </button>
                </div>

                <div className="text-center py-4 rounded-lg px-6 mt-5">
                    <button id="songButton"
                            className="bg-indigo-700 px-6 py-4 shadow-2xl shadow-veryDarkBlue font-bold text-white rounded-full shadow-amber-300 hover:bg-transparentIndigoBlue hover:text-indigo-700 trans duration-100 active:bg-darkerTransparentIndigoBlue">
                        Get Tracks
                    </button>
                </div>
            </div>
            {/*Location Dropdown*/}


            {/*footer*/}
            <p className="text-center text-white">{apiData}</p>

        </>
    )
}

export default App;