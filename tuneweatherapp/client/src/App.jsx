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
            <nav className="flex flex-row mx-auto bg-gray-200 justify-between  items-center">
                <div id="productName" className="flex flex-row p-6 ml-7 sm:text-2xl mb-0.5">
                    <h1 className="text-xl font-extrabold md:text-xl">
                        <strong className="text-[#030d15]">Tune</strong> <strong className="text-indigo-700">Weather</strong></h1>
                </div>

                {/*        username/loggedin status*/}
                <div className="flex flex-row  rounded-full items-center h-12 pr-1 mr-7">
                    <h2 id="userLoginStatus"
                        className="text-md text-center text-[#030d15] tracking-wider px-4 font-extrabold sm:text-sm md:text-md lg:text-md xl:text-xl">
                        username</h2>
                </div>
            </nav>

            {/*Hero*/}
            <div className="translate-y-20 mx-auto">
                <section id="hero" className="flex flex-col-reverse my-24 mx-32">
                    <div id="headText" className="flex flex-col items-center justify-between rounded-2xl">
                        <h2 className="text-white  text-4xl font-extrabold leading-tight justify-center relative md:text-5xl xl:text-6xl">
                            Welcome to <strong className="text-indigo-600">Tune-Weather.</strong> A product that lets <strong
                            className="text-indigo-600">nature</strong> decide what you listen to . . .</h2>
                    </div>
                </section>

                {/*Button to fetch songs*/}
                <div className="h-screen/2 grid place-items-center">
                    <div className="flex relative flex-col justify-between w-[240px] items-center rounded-lg px-6 mt-5">
                        <button id="dropDown"
                                className="bg-indigo-700 py-4 shadow-2xl shadow-veryDarkBlue flex-col justify-between font-bold text-white w-full rounded-full shadow-amber-300 hover:bg-transparentIndigoBlue hover:text-indigo-700 trans duration-100 active:bg-darkerTransparentIndigoBlue">
                            Get Tracks
                        </button>
                    </div>
                </div>
            </div>
            {/*Location Dropdown*/}


            {/*footer*/}
            <footer>
                <div className="flex flex-row bg-indigo-700 w-screen h-[168px] absolute bottom-0 items-center contain-content">
                    <div className="flex flex-col p-10 relative items-center ">
                        <h5 className="text-darkerTransparentIndigoBlue mt-2 text-sm leading-tight r">Copyright &copy; 2024, All Rights Reserved</h5>
                    </div>

                </div>
            </footer>
        </>
    )
}

export default App;