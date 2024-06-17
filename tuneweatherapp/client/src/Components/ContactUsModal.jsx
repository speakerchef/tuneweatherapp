import React from 'react';
import {FaArrowRight, FaWindowClose} from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUsModal = ({closeModal, modalHandler}) => {

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append("access_key", "95d5b42c-7264-4760-9c70-537ecd32183a");

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: json
        }).then((res) => res.json());

        if (res.success) {
            toast.success("Message Sent!", {
                position: "top-right",
            })
            modalHandler()
            console.log("Message Sent", res);
            return
        } else {
            toast.error("Message could not be sent, please try again!" ,{
                position: 'top-right'
            })
            }
    };

    return (
        <>
            <ToastContainer
            theme='dark'
            />
            <div className={`flex justify-center items-center ${closeModal ? 'hidden' : ''}`}>
                <div id="contactFormModal" className="fixed z-10 inset-0 overflow-y-auto ">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="bg-darkerTransparentIndigoBlue w-1/2 p-6 rounded-xl shadow-md">
                            <div className="flex justify-end">
                                <button id="closeContactForm" className="text-gray-700 text-xl hover:text-indigo-700 active:text-red-600 transition-all"
                                onClick={modalHandler}>
                                    <FaX/>
                                </button>
                            </div>
                            <h2 className="text-2xl text-indigo-700 font-bold mb-4">Contact Us</h2>

                            <form onSubmit={onSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name"
                                           className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input type="text" id="name" name="name" required={true}
                                           className="w-full bg-gray-800 p-2 text-white rounded-md focus:outline-none focus:ring-1 ring-indigo-700 transition-all"/>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email"
                                           className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input type="email" id="email" name="email" required={true}
                                           className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 ring-indigo-700 transition-all"/>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="message"
                                           className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                                    <textarea id="message" name="message" required={true}
                                              className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 ring-indigo-700 transition-all"></textarea>
                                </div>
                                <button type="submit"
                                        className="bg-indigo-700 text-white  py-2 px-4 rounded hover:bg-indigo-600 active:bg-indigo-950 transition-all">
                                    Submit <FaArrowRight className="inline mb-0.5 text-sm"/>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsModal;