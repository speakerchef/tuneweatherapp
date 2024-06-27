import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaEnvelope,
  FaHome,
  FaBook,
  FaGithubSquare, FaHamburger, FaLine,
} from "react-icons/fa";
import LogoutIcon from "./LogoutIcon.jsx";
import NavBarLogo from "./NavBarLogo.jsx";
import ContactUsModal from "./ContactUsModal.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import {FaBurger, FaHouse, FaX} from "react-icons/fa6";
import HamburgerMenu from "./HamburgerMenu.jsx";
import { GiHamburgerMenu } from "react-icons/gi";
import {IoClose} from "react-icons/io5";
import NavLinks from "./NavLinks.jsx";




const NavBar = ({ isLoggedIn }) => {
  const [privacyHidden, setPrivacyHidden] = useState(true);
  const [z, setZ] = useState(false);
  const [closeModal, setCloseModal] = React.useState(true);
  const [menu, setMenu] = React.useState(true);

  function clickHandler() {
    setZ((prev) => !prev);
    setPrivacyHidden(!privacyHidden);
  }

  function contactUsHandler() {
    setCloseModal((prev) => !prev);
  }

  function modalCloser() {
    setCloseModal((prev) => !prev);
  }

  return (
    <>

      {/*navigation bar*/}
      <ContactUsModal closeModal={closeModal} modalHandler={contactUsHandler} />
      <PrivacyPolicy isHidden={privacyHidden} clickHandler={clickHandler} />

      <nav className="flex flex-row bg-darkerTransparentIndigoBlue w-full z-0 shadow-md shadow-gray-900 py-4 md:p-0 items-center">
        {/* Position the logo on the left */}
        <div className="flex flex-row items-center justify-start flex-1">
          <NavBarLogo/>
        </div>

        <NavLinks setCloseModal={modalCloser} clickHandler={clickHandler}/>
        {/* Username/logged-in status */}
        <div className="flex flex-row rounded-full items-center h-6 mr-5">
          <button
              id="userLoginStatus"
              className="text-md text-center px-4 font-extrabold sm:text-sm md:text-lg lg:text-xl xl:text-xl"
          >
            <LogoutIcon isLoggedIn={isLoggedIn}/>
          </button>
        </div>
        <div className={`flex flex-row items-center md:hidden mr-4`}>
          <button onClick={() => setMenu(prev => !prev)} className="">
            {menu ? <GiHamburgerMenu className="text-indigo-700 flex text-[1.5rem] transition-all duration-75"/> : <IoClose className="-mr-1 text-indigo-700 text-[2rem]"/>}
          </button>
        </div>
      </nav>
      <HamburgerMenu menuHidden={menu} contactHandler={contactUsHandler} privacyHandler={clickHandler}/>
    </>
  );
};

export default NavBar;
