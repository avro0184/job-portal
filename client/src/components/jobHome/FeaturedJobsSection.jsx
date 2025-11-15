import { useTheme } from "@mui/material/styles";
import { Typography, Box, Chip, Button } from "@mui/material";
import { useRouter } from "next/router";
import { FaArrowRight } from "react-icons/fa";

export default function FeaturedJobsSection({ jobs = [], singleColumn = false }) {
  const theme = useTheme();
  const router = useRouter();

  // Convert API fields → UI fields
  const formattedJobs = jobs.map(job => ({
    ...job,
    tagLeft: job.location,
    tagRight: `${job.salary_min} - ${job.salary_max} ${job.salary_currency}`,
    salary: `${job.salary_min} - ${job.salary_max} ${job.salary_currency}`,
  }));

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" color="textPrimary" fontWeight={600} gutterBottom>
        Featured Jobs
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: singleColumn
            ? "1fr"
            : { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        {formattedJobs.map((job) => (
          <Box
            key={job.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 3,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#020617"
                  : theme.palette.background.paper,
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.3)"
                  : theme.palette.divider
              }`,
              boxShadow: 1,
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(37, 99, 235, 0.1)"
                    : theme.palette.action.hover,
                boxShadow: 3,
              },
            }}
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            {/* Top Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography variant="h6" color="textPrimary" fontWeight={600}>
                  {job.title}
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  {job.company_profile__company_name}
                </Typography>
              </Box>

              <Chip
                label={job.tagLeft}
                size="small"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "#1f2937"
                      : theme.palette.grey[100],
                  color: theme.palette.primary.main,
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(148, 163, 184, 0.2)"
                      : theme.palette.divider
                  }`,
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#ffffff",
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>

            {/* Bottom Row */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="textSecondary">
                {job.tagRight}
              </Typography>

              <Typography variant="body2" color="primary" fontWeight={600}>
                {job.salary}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* More Jobs Button */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          endIcon={<FaArrowRight size={14} />}
          onClick={() => router.push("/jp/jobs")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(37, 99, 235, 0.1)"
                  : theme.palette.action.hover,
            },
          }}
        >
          See More Jobs
        </Button>
      </Box>
    </Box>
  );
}
