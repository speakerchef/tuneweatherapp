import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaEnvelope,
  FaHome,
  FaBook,
  FaGithubSquare,
} from "react-icons/fa";
import LogoutIcon from "./LogoutIcon.jsx";
import NavBarLogo from "./NavBarLogo.jsx";
import ContactUsModal from "./ContactUsModal.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import { FaHouse } from "react-icons/fa6";

const NavBar = ({ isLoggedIn }) => {
  const [privacyHidden, setPrivacyHidden] = useState(true);
  const [z, setZ] = useState(false);
  const [closeModal, setCloseModal] = React.useState(true);

  function clickHandler() {
    setZ((prev) => !prev);
    setPrivacyHidden(!privacyHidden);
  }

  function contactUsHandler() {
    setCloseModal((prev) => !prev);
  }

  return (
    <>
      {/*navigation bar*/}
      <ContactUsModal closeModal={closeModal} modalHandler={contactUsHandler} />
      <PrivacyPolicy isHidden={privacyHidden} clickHandler={clickHandler} />
      <nav className="flex flex-row bg-darkerTransparentIndigoBlue  items-center">
        {/* Position the logo on the left */}
        <div className="flex flex-row items-center justify-start flex-1">
          <NavBarLogo />
        </div>
        <div className="socialIcons bg-gradient-to-r from-indigo-700 space-x-6 to-darkMagenta text-transparent bg-clip-text justify-end mr-2 flex  invisible text-[0rem] md:visible sm:text-[0.66rem] md:text-[0.70rem] lg:mr-4 xl:mr-6 xxl:mr-12 lg:text-[0.79rem]">
          <button
            onClick={() => setCloseModal(!closeModal)}
            className="transition-all py-4 duration-100 hover:cursor-pointer focus:outline-none focus:border-b-4 border-darkMagenta px-4 "
          >
            <h3>
              {/*<FaEnvelope className="inline mr-2 mb-1" />*/}
              Contact Us
            </h3>
          </button>
            <a href='/'
                className="p-0 transition-all py-4 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
              <h3>
                {/*<FaHouse className="inline mr-2 md:text-[0.8rem] lg:text-[0.89rem] mb-1" />*/}
                Home
              </h3>
            </a>
            <button
                onClick={clickHandler}
                className="p-0 transition-all py-4 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
              <h3>
                {/*<FaBook className="inline mr-2 mb-1" />*/}
                Privacy Policy
              </h3>
            </button>
            <a
                href="https://github.com/speakerchef/tuneweatherapp"
                className="p-0 transition-all py-4 duration-100 hover:cursor-pointer px-4 focus:outline-none focus:border-b-4 border-darkMagenta">
              <h3>
                {/*<FaGithubSquare className="inline mr-2 mb-1" />*/}
                GitHub
              </h3>
            </a>
        </div>
        {/* Username/logged-in status */}
        <div className="flex flex-row rounded-full items-center h-6 mr-5">
          <button
            id="userLoginStatus"
            className="text-md text-center px-4 font-extrabold sm:text-sm md:text-lg lg:text-xl xl:text-xl"
          >
            <LogoutIcon isLoggedIn={isLoggedIn} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
