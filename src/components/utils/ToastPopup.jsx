import { toast, Slide } from "react-toastify";

const ToastPopup = (message, msgType) => {
  const settings = {
    closeButton: false,
    autoClose: true,
    transition: Slide,
    type: msgType ?? "success",
  };

  toast(message, settings);
};

export default ToastPopup;
