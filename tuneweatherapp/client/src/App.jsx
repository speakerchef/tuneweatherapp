import {useEffect, useState} from "react";
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import NavBar from "./Components/NavBar.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";

const App = () => {


    return (
        <>
           <Home/>
        </>
    )
}

export default App;