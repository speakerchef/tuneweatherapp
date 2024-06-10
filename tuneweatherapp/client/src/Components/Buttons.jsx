import React, { useState, useEffect } from "react";
import { location_api_key } from "../../../server/config.js";
import Button from './Button.jsx'

// Button implementation page
const Buttons = ({ buttonHidden }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");



  // useEffect(() => {
  //   const getUserLocation = async () => {
  //     if (!navigator.geolocation) {
  //       alert("Geolocation is not supported");
  //     } else {
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude),
  //           (err) => {
  //             console.log(err);
  //           };
  //       });
  //     }
  //   };
  //   const reverseGeoUrl = `https://api-bdc.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&key=${location_api_key}`;
  //   const userCity = fetch(reverseGeoUrl)
  //     .then((res) => res.json())
  //     .then((data) => setLocation(data.city));
  // }, [locationClicked]);

  return (
<Button/>
  );
};

export default Buttons;
