import React from 'react';
import Hero from '../Components/Hero.jsx'
import NavBar from '../Components/NavBar.jsx'
import Button from '../Components/Button.jsx'

const Home = () => {
    return (
        <>
            <NavBar/>
            <Hero playlistSectionHeadersHidden={true} iframeHidden={true} dashboardHeaderHidden={true}/>
            <Button/>
        </>
    );
};

export default Home;