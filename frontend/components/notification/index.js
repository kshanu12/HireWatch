import { toast } from "react-toastify";

export const errorToast = (errorMsg) => {
  toast.error(errorMsg, {
    toastId: "errorToast",
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const successToast = (successMsg) => {
  toast.success(successMsg, {
    toastId: "successToast",
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const pendingToast = (pendingMsg) => {
  toast.info(pendingMsg, {
    toastId: "pendingToast",
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};
