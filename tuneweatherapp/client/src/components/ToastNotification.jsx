import React from 'react';
import {toast} from 'react-toastify';


export const ToastNotification = (msg, delay = 2500) => {
    toast.info(msg, {
        position: 'top-center',
        autoClose: delay,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
    });
};

export default ToastNotification;