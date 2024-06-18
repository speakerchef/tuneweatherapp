import {useEffect, useState} from "react";
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import NavBar from "./components/NavBar.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Playlist from "./pages/Playlist.jsx";
import axios from "axios";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify"

const App = () => {



    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/playlist" element={<Playlist/>} />
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;