import React, {useEffect, useState} from 'react';
export let sessionId


// Button component
const Button = ({buttonText = "Link Spotify",}) => {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);


    useEffect(() => {
        const getUserLocation = async () => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported");
            } else {
                navigator.geolocation.getCurrentPosition((position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude),
                        (err) => {
                            console.log(err);
                        };
                });
            }
        };

        getUserLocation().then(() => console.log("location retrieved"));
    }, [])



    const sendUserLocation = async () => {
        const res = await fetch(
            `http://localhost:5001/location?latitude=${latitude}&longitude=${longitude}`,
            {
                method: "POST",
            },
        );
        const data = await res;
        return data;
    };

    const login = async () => {
        if(loggedIn){
            await sendUserLocation();
            return
        } else {
            window.location.replace('http://localhost:5001/login')
            setLoggedIn(true);
            await sendUserLocation()
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