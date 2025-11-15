"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import { useParams } from "next/navigation";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { useRouter } from "next/router";

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;     // <-- FIX
  const token = getToken();
  const [job, setJob] = useState(null);

  // ---------------- Fetch Job by ID ----------------
  const fetchJob = async () => {
    try {
      const res = await apiRequest(`/jobs/${id}/`, "GET", token);
      setJob(res);
    } catch (err) {
      console.log("Job load error", err);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  if (!job) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: "center",
          color: "gray",
          fontSize: "20px",
        }}
      >
        Loading job details...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        background: (theme) => (theme.palette.mode === "dark" ? "#000" : "#f5f5f5"),
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4} maxWidth="lg" mx="auto">
        
        {/* ---------------- LEFT SIDE ---------------- */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#111" : "#fff",
              borderRadius: 3,
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid #333"
                  : "1px solid rgba(0,0,0,0.1)",
              p: 3,
            }}
          >
            {/* Job Title */}
            <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
              {job.title}
            </Typography>

            {/* Company */}
            <Typography variant="h6" color="text.secondary" mb={3}>
              {job.company_info?.company_name}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Job Info */}
            <Typography fontWeight={700} mb={1}>
              Job Overview
            </Typography>
            <Typography color="text.secondary" mb={2}>
              📍 Location: {job.location}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              💼 Employment Mode: {job.employment_mode?.join(", ")}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              📘 Experience Level: {job.experience_level?.join(", ")}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              🔖 Job Type: {job.job_type?.join(", ")}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              💰 Salary: {job.salary_min} - {job.salary_max} {job.salary_currency}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              ⏳ Deadline: {job.deadline}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Skills */}
            <Typography fontWeight={700} mb={1}>
              Required Skills
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
              {job.required_skills?.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  sx={{
                    background: "rgba(0,255,150,0.1)",
                    border: "1px solid rgba(0,255,150,0.3)",
                    color: "#00e676",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Typography fontWeight={700} mb={1}>
              Job Description
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.7,
              }}
            >
              {job.description}
            </Typography>

            <Box mt={4}>
              <Button variant="contained" color="success" size="large">
                Apply Now
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* ---------------- RIGHT SIDEBAR ---------------- */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#111" : "#fff",
              borderRadius: 3,
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid #333"
                  : "1px solid rgba(0,0,0,0.1)",
              p: 3,
              position: "sticky",
              top: 20,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Company Information
            </Typography>

            <Typography color="text.secondary" mb={1}>
              <b>Company:</b> {job.company_info?.company_name}
            </Typography>

            <Typography color="text.secondary" mb={1}>
              <b>Email:</b> {job.company_info?.contact_email}
            </Typography>

            <Typography color="text.secondary" mb={1}>
              <b>Phone:</b> {job.company_info?.contact_phone}
            </Typography>

            <Typography color="text.secondary" mb={1}>
              <b>Address:</b> {job.company_info?.address}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
