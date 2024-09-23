import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const SignupConfirmation = ({ message, redirectPath, onClose }) => {
  const navigateTo = useNavigate();
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    const showToast = () => {
      if (isToastVisible) return;

      setIsToastVisible(true);

      if (message.status === "fail") {
        toast.error(message.message, {
          position: "top-center",
          autoClose: 3000,
          onClose: () => {
            setIsToastVisible(false);
            onClose();
          },
        });
        return;
      }

      toast.success(message || "Confirmation", {
        position: "top-center",
        autoClose: 1000,
        onClose: () => {
          setIsToastVisible(false);
          navigateTo(redirectPath);
        },
      });

      const timer = setTimeout(() => {
        navigateTo(redirectPath);
      }, 1000);

      return () => clearTimeout(timer);
    };

    showToast();
  }, [message, redirectPath, navigateTo, onClose, isToastVisible]);

  return <ToastContainer />;
};

export default SignupConfirmation;
