import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import useTranslate from "@/hooks/useTranslation";

export default function LoginRequiredModal({ isOpen, onClose }) {
    const {t } = useTranslate()
  const handleLogin = () => {
    window.location.href = "/signin"; // Navigate to the sign-in page
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="login-required-dialog-title"
      aria-describedby="login-required-dialog-description"
      className="transition-transform duration-500 transform"
    >
      <DialogTitle
        id="login-required-dialog-title"
        className="text-center text-4xl border-b font-extrabold text-blue-600"
      >
        {t("Access Restricted")}
      </DialogTitle>

      <DialogContent className="px-8 py-6 mt-5 border-b rounded-lg">
        <div className="text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            {t("You need to be logged in to view this content. Log in to unlock all features, including personalized content and progress tracking.")}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {t("If you don't have an account, you can sign up for free. It's quick and easy!")}
          </p>
        </div>
      </DialogContent>

      <DialogActions className="px-8 pb-8 flex justify-between items-center space-x-4">
        <Button
          onClick={onClose}
          className="flex-1 sm:flex-none bg-gray-300 text-gray-700 rounded-lg py-2 px-6 text-lg font-medium transition-all hover:bg-gray-400"
          variant="contained"
          color="error"
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={handleLogin}
          className="flex-1 sm:flex-none bg-indigo-600 text-white rounded-lg py-2 px-6 text-lg font-medium transition-all hover:bg-indigo-700"
          variant="contained"
        >
          {t("Login")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
