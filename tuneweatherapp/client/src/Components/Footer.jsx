import React, {useState} from "react";
import {FaInstagram, FaGlasses, FaEnvelope, FaHome, FaUser, FaInfo, FaBook} from "react-icons/fa";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import ContactUsModal from "./ContactUsModal.jsx";

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
        <ContactUsModal closeModal={closeModal} modalHandler={contactUsHandler}/>
        <PrivacyPolicy isHidden={privacyHidden} clickHandler={clickHandler}/>
        <footer
            className={`relative ${z ? '-z-10' : ''} p-2 bg-darkerTransparentIndigoBlue text-indigo-700 text-center  text-[0.8rem] w-full mt-auto`}>
          <div
              className="socialIcons md:justify-center flex-col md:space-x-12 lg:space-x-24 xl:space-x-32 flex md:flex-row text-[0.95rem] mb-2 mt-2 items-center">
            <a onClick={() => setCloseModal(!closeModal)}>
              <div
                  className="p-4 transition-all border-indigo-700 hover:border-0 duration-100 hover:ring-2 ring-indigo-700 px-12 active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
                <h3>
                  <FaHome className="inline mr-2 mb-1"/>
                  Contact Us
                </h3>
              </div>
            </a>
            <div className="md:py-8 px-20 py-[0.05rem] flex flex-col md:flex-row md:px-[0.05rem] bg-indigo-700"/>
            <a href="/">
              <div
                  className="p-4 transition-all border-indigo-700 hover:border-0 duration-100 hover:ring-2 ring-indigo-700 px-12  active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
                <h3>
                  <FaHome className="inline mr-2 mb-1"/>
                  Home
                </h3>
              </div>
            </a>
            <div className="md:py-8 px-20 py-[0.05rem] flex flex-col md:flex-row md:px-[0.05rem] bg-indigo-700"/>
            <a onClick={clickHandler}>
              <div
                  className="p-4 hover:cursor-pointer transition-all border-indigo-700 hover:border-0 duration-100 hover:ring-2 ring-indigo-700 px-12 active:bg-indigo-700 active:text-darkerTransparentIndigoBlue">
                <h3>
                  <FaHome className="inline mr-2 mb-1"/>
                  Privacy Policy
                </h3>
              </div>
            </a>
          </div>

        </footer>
        <div className="bg-indigo-700 text-darkerTransparentIndigoBlue flex justify-center text-sm">
          <p>Copyright 2024 © All rights reserved - TuneWeather</p>
        </div>
      </div>
  );
};

export default Footer;
