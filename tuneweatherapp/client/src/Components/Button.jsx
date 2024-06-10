import React from 'react';


// Button component
const Button = ({buttonText = "Link Spotify", hideButton}) => {
    return (
        <>
            <div className=" -translate-x-30 m-auto ">
                {/*Button to link spotify*/}
                <div className="flex-col flex items-center fle text-center">
                    <div className="text-center -my-14  ">
                        <button
                            className={`${hideButton ? 'hidden' : ''} text-md bg-indigo-700 py-3.5 rounded-2xl hover:ring-1 hover:ring-indigo-700 hover:bg-darkerTransparentIndigoBlue hover:text-indigo-700 transition-all duration-100 ease-in px-8 active:ring-1 active:ring-red-600 font-bold active:bg-darkerTransparentIndigoBlue md:text-lg lg:text-xl lg:px-8 lg:py-4 xl:px-9 xl:py-5`}
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