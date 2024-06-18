import React from 'react';
import {IoClose} from "react-icons/io5";

const PrivacyPolicy = ({isHidden, clickHandler}) => {
    return (
      <div className={`${isHidden && isHidden ? 'hidden':''} fixed z-30 mt-12 justify-center flex inset-0 overflow-y-auto`} >
        <div className="relative bg-white p-4 md:p-8 lg:p-10 w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-md m-4 rounded-2xl overflow-y-auto">
          <div className="absolute top-7 right-6 text-3xl">
            <button className={`bg-indigo-700 rounded active:opacity-70 hover:opacity-80 transition-all`}
                    onClick={clickHandler}
            >
              <IoClose/>
            </button>
          </div>

          <div className="ppDivs">
            <div className='-mt-12 date '>
              <p style={{color: "rgb(67 56 202)"}}>EFFECTIVE DATE: 25TH JUNE 2024</p>
            </div>
            <h3>1. Introduction</h3>
            <p>
              Welcome to TuneWeather ("we", "our", "us"). We value your privacy
              and are committed to protecting your personal information. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our service, which
              includes our website (collectively, the "Service"). By using the
              Service, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </div>
          <div className="ppDivs">
            <h3>2. INFORMATION WE COLLECT</h3>
            <h4>2.1 LOCATION DATA</h4>
            <p>
              We collect and store your location data to provide personalized
              weather-based playlist recommendations. This data is securely
              stored and is deleted upon user logout.
            </p>
            <h4>2.2 SPOTIFY ACCOUNT DETAILS</h4>
            <p>
              We collect your top-tracks to create curated playlists for you and
              we collect your account username to create customized playlist
              titles. We do not store this data to provide you with our Service.
            </p>
            <p>
              We do not collect or store any other personal information aside
              from those mentioned in this privacy policy.
            </p>
          </div>
          <div className="ppDivs">
            <h3>3. HOW WE USE YOUR INFORMATION</h3>
            <ul>
              <li>
                <strong>Location Data: </strong>To retrieve weather data for
                your location and generate weather-based playlist
                recommendations.
              </li>
              <li>
                <strong>Spotify OAuth Scopes: </strong>We use the following
                OAuth scopes to interact with your Spotify account:
                <ul className="sublist">
                  <li>
                    <strong>user-read-private: </strong>To read your username
                    and create a custom playlist name.
                  </li>
                  <li>
                    <strong>playlist-modify-private: </strong>To create and
                    modify the private playlists we create for you.
                  </li>
                  <li>
                    <strong>user-top-read: </strong>To read your top tracks and
                    provide curated recommendations.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="ppDivs">
            <h3>4. DATA DELETION</h3>
            <p>
              We are committed to ensuring your data privacy and security. Upon
              logging out of the Service, all location data is deleted from our
              databases
            </p>
          </div>
          <div className="ppDivs">
            <h3>5. DATA SECURITY</h3>
            <p>
              We implement industry-standard security measures to protect your
              data from unauthorized access, use, or disclosure.
            </p>
          </div>
          <div className="ppDivs">
            <h3>6. SHARING YOUR INFORMATION</h3>
            <p>
              We do not share your personal information with any third parties.
              Your data is used solely to provide the functionalities described
              in this policy.
            </p>
          </div>
          <div className="ppDivs">
            <h3>7. USER RIGHTS</h3>
            <h5>You have the right to:</h5>
            <ul style={{listStyle: 'inside'}}>
              <li>Delete your location data by logging out.</li>
            </ul>
          </div>
          <div className="ppDivs">
            <h3>8. CHANGES TO THIS PRIVACY POLICY</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </div>
          <div className="ppDivs">
            <h3>9. CONTACT US</h3>
            <p style={{marginBottom: '0.1rem'}}>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
              <p>
                  <strong>Email:</strong> <strong className="text-indigo-700">tuneweather@gmail.com</strong>
              </p>
          </div>
        </div>
      </div>
    );
};

export default PrivacyPolicy;