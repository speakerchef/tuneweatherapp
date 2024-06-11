import React, {useEffect, useState} from 'react';
export let sessionId


// Button component
const Button = ({buttonText = "Link Spotify",}) => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [toggle, setToggle] = useState(2);


    useEffect(() => {
        const getUserLocation = async () => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported");
            } else {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude
                    const lon = position.coords.longitude
                    setLatitude(lat.toString());
                    setLongitude(lon.toString()),
                        (err) => {
                            console.log(err);
                        };
                });
            }
        };

        getUserLocation().then(() => console.log("location retrieved"));
    }, [])



        const sendUserLocation = async () => {
            if (latitude && longitude) {
                try {
                    console.log(latitude, longitude)
                    const res = await fetch(
                        `http://localhost:5001/location?latitude=${latitude}&longitude=${longitude}`,
                        {
                            method: "POST",
                        });
                    const data = await res;
                    console.log(data)
                } catch (e) {
                    console.log("Error sending location", e)
                } finally {
                }
            } else {

            }
        }


    const login = async () => {
        sendUserLocation()
        setToggle(prevState => prevState + 1);
        if(loggedIn){
            console.log("User exists")
            return
        } else {
            window.location.replace('http://localhost:5001/login')
            console.log("Location sent")
            setLoggedIn(true);
            return
        }
    }
    return (
        <>
            <div className=" -translate-x-30 m-auto ">
                {/*Button to link spotify*/}
                <div className="flex-col flex items-center fle text-center">
                    <div className="text-center -my-14  ">
                        <button onClick={login}
                            className={` text-md bg-indigo-700 py-3.5 rounded-2xl hover:ring-1 hover:ring-indigo-700 hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-100 ease-in px-8 active:ring-1 active:ring-red-600 font-bold active:bg-darkerTransparentIndigoBlue md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5`}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Button;