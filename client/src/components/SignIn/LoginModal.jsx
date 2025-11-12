"use client";

import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import LoginForm from "@/components/SignIn/LoginForm";
import useTranslate from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import { getToken } from "@/utils/auth";

export default function LoginModal({ isOpen, onClose }) {
  const [token, setToken] = useState(null);
  const { t } = useTranslate();
  const router = useRouter();

  return (
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose(false);
        }
      }}
      maxWidth="xs"
    >
      <div className="dark:bg-gray-800 border rounded dark:border-primary">
        <DialogTitle className="flex justify-between items-center">
          {t("Sign In")}
          <button
            onClick={() => router.back()}
            className="hidden md:inline-flex dark:text-white items-center gap-1 text-sm text-primary hover:underline shrink-0"
          >
            ← {t("Go Back to Previous Page")}
          </button>
        </DialogTitle>

        <DialogContent dividers>
          <LoginForm
            onSuccess={() => {
              onClose();
              setToken(getToken()); // refresh token
            }}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
