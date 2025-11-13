"use client";

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";
import toast from "react-hot-toast";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { getUserInfo } from "@/Redux/auth/UserInfoSlice";

export default function UserInfoPanel({ user , token }) {

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveUser = async () => {
    try {
      const res = await apiRequest(
        "/auth/profile-info/",
        "PATCH",
        token,
        form
      );
      if (res?.success) {
        toast.success(res?.message || "User info updated");    
        getUserInfo(token);
      } else toast.error(res?.error || "Failed");
    } catch (e) {
      toast.error("Error updating user info");
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        User Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TextField
        fullWidth
        label="Full Name"
        name="full_name"
        value={form.full_name}
        onChange={onChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Phone Number"
        name="phone_number"
        value={form.phone_number}
        onChange={onChange}
        sx={{ mb: 3 }}
      />

      <Button variant="contained" onClick={saveUser}>
        Save User Info
      </Button>
    </Box>
  );
}
