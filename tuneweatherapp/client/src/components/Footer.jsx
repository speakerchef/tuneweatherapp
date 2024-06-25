import React, {useState} from "react";
import {
  FaInstagram,
  FaGlasses,
  FaEnvelope,
  FaHome,
  FaUser,
  FaInfo,
  FaBook,
  FaGithub,
  FaGithubSquare
} from "react-icons/fa";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import ContactUsModal from "./ContactUsModal.jsx";
import {FaHouse} from "react-icons/fa6";

const Footer = () => {
  const [privacyHidden, setPrivacyHidden] = useState(true);
  const [z, setZ] = useState(false);
  const [closeModal, setCloseModal] = React.useState(true);

  function clickHandler() {
    setZ(prev => !prev)
    setPrivacyHidden(!privacyHidden);
  }

  function contactUsHandler() {
    setCloseModal(prev => !prev)
  }


  return (
    <div className="footerContainer">
      <ContactUsModal closeModal={closeModal} modalHandler={contactUsHandler} />
      <PrivacyPolicy isHidden={privacyHidden} clickHandler={clickHandler} />
      <footer
        className={`relative ${z ? "-z-10" : ""} p-2 bg-darkerTransparentIndigoBlue text-indigo-700 text-center  text-[0.8rem] w-full mt-auto`}
      >
        <div className="socialIcons flex-col  font-thin  flex text-[0.95rem] mb-2 mt-2 items-center">
          <a onClick={() => setCloseModal(!closeModal)}>
            <div className="p-4 transition-all border-indigo-700 hover:border-0 duration-100 hover:cursor-pointer px-12 active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
              <h3>
                <FaEnvelope className="inline mr-2 mb-1" />
                Contact Us
              </h3>
            </div>
          </a>
          {/*<div className="lg:py-8 px-20 py-[0.05rem] flex flex-col md:flex-row lg:px-[0.05rem] bg-indigo-700" />*/}
          <div className=" px-20 md:px-28 lg:px-36 xl:px-48 py-[0.05rem] flex flex-col  bg-indigo-700" />
          <a href="/">
            <div className="p-4 transition-all border-indigo-700 hover:border-0 duration-100 hover:cursor-pointer px-12 active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
              <h3>
                <FaHouse className="inline mr-2 mb-1" />
                Home
              </h3>
            </div>
          </a>
          <div className=" px-20 md:px-28 lg:px-36 xl:px-48 py-[0.05rem] flex flex-col  bg-indigo-700" />
          <a onClick={clickHandler}>
            <div className="p-4 transition-all border-indigo-700 hover:border-0 duration-100 hover:cursor-pointer px-12 active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
              <h3>
                <FaBook className="inline mr-2 mb-1" />
                Privacy Policy
              </h3>
            </div>
          </a>
          <div className=" px-20 md:px-28 lg:px-36 xl:px-48 py-[0.05rem] flex flex-col  bg-indigo-700" />
          <a href="https://github.com/speakerchef/tuneweatherapp">
            <div className="p-4 transition-all border-indigo-700 hover:border-0 duration-100 hover:cursor-pointer px-12 active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
              <h3>
                <FaGithubSquare className="inline mr-2 mb-1" />
                GitHub
              </h3>
            </div>
          </a>
        </div>
      </footer>
      <div className="bg-darkerTransparentIndigoBlue text-darkMagenta flex justify-center text-[0.7rem]">
        <p className="pb-2">Copyright 2024 © All rights reserved - TuneWeather</p>
      </div>
    </div>
  );
};

export default Footer;
