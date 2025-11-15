"use client";

import apiRequest from "@/utils/api";
import { 
  Paper, Typography, Stack, Box, Chip, Divider 
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ApplicationActivity({ token }) {
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [pendingJobsCount, setPendingJobsCount] = useState(0);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchMyApplications = async () => {
      const response = await apiRequest("my-applications/", "GET", token);

      if (response?.success) {
        setAppliedJobsCount(response.total);
        setApplications(response.applications);

        // Calculate pending applications
        const pending = response.applications.filter(
          (app) => app.status === "Applied"
        ).length;
        setPendingJobsCount(pending);
      }
    };

    fetchMyApplications();
  }, [token]);

  // Status → Chip color logic
  const statusColor = (status) => {
    switch (status) {
      case "Applied":
        return "warning";
      case "Shortlisted":
      case "Interview Scheduled":
      case "Interview Completed":
        return "info";
      case "Offered":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Your Application Activity
      </Typography>

      {/* Overview Boxes */}
      <Stack direction="row" spacing={4} sx={{ mt: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {appliedJobsCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Applied Jobs
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {pendingJobsCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending Review
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Applications */}
      <Typography variant="subtitle2" sx={{ mb: 2, color: "text.secondary" }}>
        Recent Applications
      </Typography>

      <Stack spacing={2}>
        {applications.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            You haven't applied to any jobs yet.
          </Typography>
        ) : (
          applications.map((app) => (
            <Box
              key={app.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {app.job_title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {app.company_name} • {app.location}
                </Typography>
              </Box>

              <Chip
                label={app.status}
                size="small"
                color={statusColor(app.status)}
              />
            </Box>
          ))
        )}
      </Stack>
    </Paper>
  );
}
