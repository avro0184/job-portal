import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const GlobalMessage = () => {
  const message = useSelector((state) => state.examName.message);
  useEffect(() => {
    if (message ) {
      toast.success(message); // Show toast only if message is new
    }
  }, [message]);

  return null; // No UI rendering is needed
};

export default GlobalMessage;
