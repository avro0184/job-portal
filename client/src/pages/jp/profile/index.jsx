"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Paper, Tabs, Tab, Avatar, IconButton,
  Typography, Divider, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Loader from "@/components/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo } from "@/Redux/auth/UserInfoSlice";
import { getToken } from "@/utils/auth";

import UserInfoPanel from "@/dashboard/profile/UserInfoPanel";
import StudentProfilePanel from "@/dashboard/profile/StudentProfilePanel";
import CompanyPanel from "@/dashboard/profile/CompanyPanel";
import InstitutionPanel from "@/dashboard/profile/InstitutionPanel";
import DeletePanel from "@/dashboard/profile/DeletePanel";
import toast from "react-hot-toast";
import apiRequest from "@/utils/api";

export default function ProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const token = getToken();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo.userInfo);

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [profilePreview, setProfilePreview] = useState("");

  const callUserInfo = async () => {
    dispatch(getUserInfo(token));
  };

  useEffect(() => {
    setProfilePreview(process.env.NEXT_PUBLIC_URL_DASHBOARD + userInfo?.profile_image);
  }, [userInfo]);

const onProfilePick = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Instant preview
  setProfilePreview(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("profile_image", file);

  try {
    const res = await apiRequest(
      "/auth/upload-profile-image/",   // <-- correct endpoint
      "POST",
      token,
      formData,
    );

    if (res?.success) {
      toast.success("Profile photo updated!");
      callUserInfo(); 
    } 
  } catch (err) {
    toast.error("Error uploading image");
  }
};


  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        my: 5,
        px: { xs: 1, sm: 2, md: 4 },
        pb: { xs: 5, md: 0 },
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "calc(100vh - 150px)",
        }}
      >
        {/* SIDEBAR */}
        <Box
          sx={{
            width: { xs: "100%", md: 280 },
            borderRight: { md: "1px solid #eee" },
            p: 3,
            pb: 5,
          }}
        >
          <Box textAlign="center">
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={profilePreview}
                sx={{ width: 110, height: 110 }}
              />
              <IconButton
                component="label"
                className="dark:bg-gray-700"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "white",
                }}
              >
                <CameraAltIcon fontSize="small" />
                <input type="file" hidden accept="image/*" onChange={onProfilePick} />
              </IconButton>
            </Box>

            <Typography mt={2} fontWeight={700} fontSize="1rem">
              {userInfo?.full_name}
            </Typography>
            <Typography variant="body2">{userInfo?.email}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="scrollable"
          >
            <Tab icon={<AccountCircleIcon />} label={isMobile ? "" : "User Info"} />
            <Tab icon={<SchoolIcon />} label={isMobile ? "" : "Student"} />
            <Tab icon={<BusinessIcon />} label={isMobile ? "" : "Company"} />
            <Tab icon={<SchoolIcon />} label={isMobile ? "" : "Institution"} />
            <Tab
              icon={<DeleteForeverIcon sx={{ color: "error.main" }} />}
              label={isMobile ? "" : "Delete"}
            />
          </Tabs>
        </Box>

        {/* MAIN PANEL – SCROLLABLE CONTENT */}
        {userInfo && (
          <Box className="no-scrollbar"
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3, md: 4 },
              height: { xs: "auto", md: "calc(100vh - 150px)" },
              overflowY: { xs: "visible", md: "auto" },
            }}
          >
            {tab === 0 && (
              <UserInfoPanel
                user={userInfo}
                token={token}
                callUserInfo={callUserInfo}
              />
            )}

            {tab === 1 && (
              <StudentProfilePanel
                profile={userInfo?.profile}
                token={token}
                callUserInfo={callUserInfo}
              />
            )}

            {tab === 2 && (
              <CompanyPanel
                companies={userInfo?.companies}
                token={token}
                callUserInfo={callUserInfo}
              />
            )}

            {tab === 3 && (
              <InstitutionPanel
                institutions={userInfo?.institutions}
                token={token}
                callUserInfo={callUserInfo}
              />
            )}

            {tab === 4 && <DeletePanel />}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
