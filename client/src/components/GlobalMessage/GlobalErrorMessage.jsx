import { useEffect } from "react";
import toast from "react-hot-toast";

const GlobalErrorMessage = () => {
  const errorMessage = false;

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage); // Show toast only if message is new
    }
  }, [errorMessage]);

  return null; // No UI rendering is needed
};

export default GlobalErrorMessage;
