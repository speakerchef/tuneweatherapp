import React from 'react';
import Hero from '../Components/Hero.jsx'
import NavBar from '../Components/NavBar.jsx'

const Home = () => {
    return (
        <>
            <NavBar/>
            <Hero mainHeaderHidden={'hidden'} spotifyHidden={'hidden'}/>
        </>
    );
};

export default Home;