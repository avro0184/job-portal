"use client";

import React from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import toast from "react-hot-toast";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { useConfirm } from "@/components/ConfirmDialogProvider";
import { useRouter } from "next/router";

export default function DeletePanel() {
  const token = getToken();
  const router = useRouter();

  const confirm = useConfirm();

  const deleteAccount = async () => {
    confirm({ title: "Delete Account", content: "Are you sure? This action is permanent. All your data will be removed , When you requested for delete then after 30 days your account will be deleted. If you want to restore your account then you can contact us or login with your email and password" , cancelText: "Cancel", confirmText: "Delete" }).then(async (result) => {
        try {
          const res = await apiRequest("/auth/profile-info/", "DELETE", token);
          if (res?.success) {
            toast.success("Account deleted");
            router.push("/signin");
          }
        } catch (err) {
            console.log(err)
          toast.error("Error deleting account");
        }
    });

  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="error" mb={1}>
        Delete Account
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Typography mb={2}>
        This action is permanent. All your data will be removed.
      </Typography>

      <Button variant="contained" color="error" onClick={deleteAccount}>
        Delete My Account
      </Button>
    </Box>
  );
}
