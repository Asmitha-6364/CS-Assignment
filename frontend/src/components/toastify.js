// src/components/toastify.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Success toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000, // closes after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

// Error toast
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

// Info toast
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "bottom-left",
    autoClose: 4000,
    theme: "light",
  });
};
