"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

export default function PasswordPanel() {
  const token = getToken();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const changePassword = async () => {
    if (newPass !== confirmPass)
      return toast.error("Passwords do not match");

    try {
      const res = await apiRequest("/auth/change-password/", "POST", token, {
        old_password: oldPass,
        new_password: newPass,
      });

      if (res?.success) {
        toast.success("Password updated");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else toast.error(res?.error);
    } catch (err) {
      toast.error("Error updating password");
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Change Password
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TextField fullWidth label="Old Password" type="password"
        value={oldPass} onChange={(e) => setOldPass(e.target.value)} sx={{ mb: 2 }} />

      <TextField fullWidth label="New Password" type="password"
        value={newPass} onChange={(e) => setNewPass(e.target.value)} sx={{ mb: 2 }} />

      <TextField fullWidth label="Confirm New Password" type="password"
        value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} sx={{ mb: 3 }} />

      <Button variant="contained" onClick={changePassword}>
        Update Password
      </Button>
    </Box>
  );
}
