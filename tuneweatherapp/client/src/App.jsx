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

            {/*navigation bar*/}
            <nav className="flex flex-row bg-indigo-700 space-y-1 border-b-2 border-gray-500 justify-between items-center">
                <div id="productName" className="flex flex-row p-3 ml-10 sm:text-2xl mb-0.5">
                    <h1 className="text-md  font-extrabold">
                        <strong className="text-[#030d15]">Tune</strong> <strong className="text-white font-bold">Weather</strong></h1>
                </div>

                {/*        username/loggedin status*/}
                <div className="flex flex-row  rounded-full items-center h-6 pb-1 mr-5">
                    <h2 id="userLoginStatus"
                        className="text-md text-center text-[#030d15] tracking-wider px-4 font-extrabold sm:text-sm md:text-md lg:text-md xl:text-xl">
                        ()</h2>
                </div>
            </nav>

            {/*Hero*/}
            <div className=" flex flex-col bg-indigo-700 mx-auto w-full">
                <section id="hero" className="flex flex-col-reverse my-24 mx-32">
                    <div id="headText" className="flex flex-col items-center justify-between rounded-2xl">
                        <h2 className="text-white text-4xl text-center font-extrabold leading-tight justify-center relative md:text-5xl xl:text-6xl">
                            Welcome to <strong className="text-darkerTransparentIndigoBlue">Tune-Weather.</strong> A product that lets <strong
                            className="text-darkerTransparentIndigoBlue">nature</strong> decide what you listen to <strong className="text-darkerTransparentIndigoBlue"> . . .</strong></h2>
                    </div>
                </section>

                {/*Button to fetch songs*/}
                <div className="items-center text-center">
                    <div className="flex flex-col text-center rounded-lg px-6 mt-5">
                        <button id="dropDown"
                                className="bg-indigo-700 py-4 shadow-2xl font-bold text-white rounded-full shadow-white hover:bg-transparentIndigoBlue hover:text-indigo-700 trans duration-100 active:bg-darkerTransparentIndigoBlue">
                            Get Tracks
                        </button>
                    </div>
                </div>
            </div>
            {/*Location Dropdown*/}


            {/*footer*/}

        </>
    )
}

export default App;