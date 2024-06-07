import {useEffect, useState} from "react";
import React from 'react';
import axios from 'axios';
import Buttons from "./Components/Buttons.jsx";
import {FaMapMarkerAlt , FaMapMarker} from "react-icons/fa";
import logo from "./assets/tw-dark-indigo-clean.png"
import IFrame from "./Components/IFrame.jsx";
import Hero from "./Components/Hero.jsx";
import {createBrowserRouter, Route, Routes} from 'react-router-dom'
import Home from "./pages/Home.jsx";


const App = () => {

    createBrowserRouter(

        <Routes>
            <Route path index = './Home'/>
        </Routes>
    )
    return (
        <>


            <Hero spotifyHidden={''} iframeHidden={'hidden'} playlistSectionHeadersHidden={'hidden'}/>
        </>
    )
}

export default App;