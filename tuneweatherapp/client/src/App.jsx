import {useEffect, useState} from "react";
import React from 'react';
import axios from 'axios';
import Buttons from "./Components/Buttons.jsx";
import {FaMapMarkerAlt , FaMapMarker} from "react-icons/fa";


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
                    <a href="#" className="text-md hover:text-black font-extrabold sm:text-sm sm:pt-1 md:text-lg lg:text-xl"> <strong className="text-[#030d15]">Tune</strong> <strong className="text-white font-bold">Weather</strong></a>
                </div>

                {/*        username/loggedin status*/}
                <div className="flex flex-row  rounded-full items-center h-6 pb-1 mr-5">
                    <button id="userLoginStatus"
                        className="text-md text-center transition-all duration-200 hover:cursor-pointer hover:text-2xl hover:text-red-600 text-[#030d15] tracking-wider px-4 font-extrabold sm:text-sm md:text-lg lg:text-xl xl:text-xl">
                      <FaMapMarkerAlt></FaMapMarkerAlt>  </button>
                </div>
            </nav>

            {/*Hero*/}
            <div className=" flex flex-col bg-indigo-700 mx-auto w-full pb-20">
                <section id="hero" className="flex flex-col-reverse my-[8rem] mx-32">
                    <div id="headText" className="flex flex-col items-center justify-between rounded-2xl">
                        <h2 className="text-white text-center font-extrabold sm:text-4xl md:text-5xl xl:text-6xl">
                            Welcome to <strong className="text-darkerTransparentIndigoBlue">Tune-Weather.</strong> A
                            product that lets <strong
                            className="text-darkerTransparentIndigoBlue">nature</strong> decide what <strong className="text-darkerTransparentIndigoBlue">tune</strong> you listen
                            to. . .</h2>
                    </div>
                </section>

            <Buttons/>


            </div>
            {/*Location Dropdown*/}


            {/*footer*/}

        </>
    )
}

export default App;