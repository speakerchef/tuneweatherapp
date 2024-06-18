import React from "react";


const NavBarLogo = () => {
  const [homeHidden, setHomeHidden] = React.useState(true);

  const homeHover = () => {
    setHomeHidden(false);
  };

  return (
    <div
      id="productName"
      className="flex relative flex-row  md:py-4 ml-2 sm:ml-4 sm:text-2xl mb-1 items-center"
    >
      {/*<a href="#" className="hover:ring-1 hover:ring-indigo-700 hover:rounded-full transition-all duration-300"> <img src={logo} alt="tune weather logo" className="size-14 mx-4 "/></a>*/}
      <a
        onMouseEnter={homeHover}
        onMouseLeave={() => setHomeHidden(true)}
        href="/"
        className={`text-xl mx-4 mt-1 hover:cursor-pointer hover:opacity-50 transition-all font-extrabold sm:text-xl  md:text-xl lg:text-2xl`}
      >
        <strong className="text-indigo-700">Tune</strong>{" "}
        <strong className="text-white font-bold">Weather</strong>
      </a>
      <div
        className={`${homeHidden ? "hidden" : ""}  absolute font-bold top-full left-1/2 transform -translate-x-1/2 w-max px-2 py-1  bg-tuneWeatherCream text-gray-900 text-sm rounded-md transition-opacity duration-300`}
      >
        Home
      </div>
    </div>
  );
};

export default NavBarLogo;
