import {
  FaBriefcase,
  FaBuilding,
  FaGlobeAmericas,
  FaUserCheck,
} from "react-icons/fa";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function StatsSection({ jobSummery }) {
  const theme = useTheme();

  // 👇 Dynamic stats mapped from API
  const stats = [
    {
      label: "Active Job Vacancies",
      value: jobSummery?.total_active_jobs ?? 0,
      sub: "Across all categories",
      icon: FaBriefcase,
    },
    {
      label: "Companies Hiring",
      value: jobSummery?.total_companies ?? 0,
      sub: "From startups to enterprises",
      icon: FaBuilding,
    },
    {
      label: "Remote Friendly Roles",
      value: jobSummery?.total_remote_jobs ?? 0,
      sub: "Work from anywhere",
      icon: FaGlobeAmericas,
    },
    {
      label: "New Jobs This Week",
      value: jobSummery?.jobs_posted_last_week ?? 0,
      sub: "Fresh opportunities added",
      icon: FaUserCheck,
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "dark" ? "#111827" : theme.palette.grey[100],
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: 2,
          py: { xs: 4, lg: 5 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          }}
        >
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
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
                  px: 2,
                  py: 2,
                  boxShadow: 1,
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
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "#1e293b"
                        : theme.palette.grey[200],
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} />
                </Box>

                {/* Text */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    fontWeight={600}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {item.value}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 0.25 }}
                  >
                    {item.label}
                  </Typography>

                  {item.sub && (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 0.5, fontSize: "0.65rem" }}
                    >
                      {item.sub}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
