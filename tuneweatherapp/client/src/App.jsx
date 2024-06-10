import {useEffect, useState} from "react";
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import NavBar from "./Components/NavBar.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import axios from "axios";

const App = () => {
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [location, setLocation] = useState('')

    useEffect(() => {
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
            const res = await fetch(`http://localhost:5001/location?latitude=${latitude}&longitude=${longitude}`, {
                method: "POST",
            })
            const data = await res
            return data
        }

        getUserLocation().then(() => sendUserLocation().then(r => {
            console.log(r)
        }))
    },[])


    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;