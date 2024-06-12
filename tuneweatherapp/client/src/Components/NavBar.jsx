import React from "react";
import { FaMapMarkerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import LogoutIcon from "./LogoutIcon.jsx";
import NavBarLogo from "./NavBarLogo.jsx";

const NavBar = () => {
  return (
    <>
      {/*navigation bar*/}
      <nav className="flex flex-row bg-darkerTransparentIndigoBlue space-y-1 border-b-2 border-gray-500 justify-between items-center">
        <NavBarLogo/>

        {/*        username/loggedin status*/}
        <div className="flex flex-row  rounded-full items-center h-6 mr-5">
          <button
            id="userLoginStatus"
            className="text-md text-center  px-4 font-extrabold sm:text-sm md:text-lg lg:text-xl xl:text-xl"
          >
            <LogoutIcon />
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
