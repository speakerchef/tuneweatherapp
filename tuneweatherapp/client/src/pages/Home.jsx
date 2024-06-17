import React, {useState} from "react";
import Hero from "../Components/Hero.jsx";
import NavBar from "../Components/NavBar.jsx";
import Button from "../Components/Button.jsx";
import { FaSpotify, FaCloudRain, FaMusic } from "react-icons/fa6";
import bgImage from "../assets/bg.svg";
import PrivacyPolicy from "../Components/PrivacyPolicy.jsx";
import Footer from "../Components/Footer.jsx";
import HowItWorks from "../Components/HowItWorks.jsx";

const Home = () => {
    const [privacyHidden, setPrivacyHidden] = useState(true);
    function clickHandler() {
        setPrivacyHidden(!privacyHidden);
    }
    return (
      <>
        <div className="flex flex-col min-h-screen">
          <div className="relative grid w-full items-center">
            <NavBar />
            <Hero
              playlistSectionHeadersHidden={true}
              iframeHidden={true}
              dashboardHeaderHidden={true}
            />
            <HowItWorks/>
            <Button />

            {/*  disclaimer*/}

            <div className="text-center mt-6 mb-20 flex justify-center items-center">
              <div className="absolute mt-10 text-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg shadow-lg">
                <p className="text-black text-sm">
                  By clicking, you accept our{" "}
                  <button
                    className="text-indigo-700 hover:text-indigo-500 hover:underline"
                    onClick={() => setPrivacyHidden((prev) => !prev)}
                  >
                    privacy policy
                  </button>
                </p>
              </div>
            </div>
          </div>
            <PrivacyPolicy
                isHidden={privacyHidden}
                clickHandler={clickHandler}
            />
          <div className="flex-grow"></div>

          {/*Spacer to push the boxes down*/}
        </div>
        <Footer/>
      </>
    );
};

export default Home;
