import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Assuming you are using react-icons for the logout icon

const LogoutIcon = () => {
const [logoutHidden, setLogoutHidden] = React.useState(true);

const logoutHover = () => {
    setLogoutHidden(false);
}


    return (
        <div className="relative group inline-block">
            <FaSignOutAlt className="text-white text-md mt-1 cursor-pointer transition-all hover:text-gray-600" onMouseOver={logoutHover} onMouseLeave={() => setLogoutHidden(true)} />
            <div className={`${logoutHidden ? 'hidden': ''} absolute top-full left-1/2 transform mt-2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-tuneWeatherCream text-gray-900 text-sm rounded-md transition-all duration-300`}>
                Logout
            </div>
        </div>
    );
};

export default LogoutIcon;