// src/components/ToastNotifications.js
import React from 'react';
import { ToastContainer,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotifications = () => {
  return (
    <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Slide}
  />
  );
};

// Add CSS styles directly


export default ToastNotifications;
