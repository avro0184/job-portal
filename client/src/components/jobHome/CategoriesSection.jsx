import {
  FaCode,
  FaBullhorn,
  FaChartBar,
  FaPaintBrush,
  FaCalculator,
  FaUsers,
  FaDollarSign,
  FaHeadset,
  FaBriefcase,
} from "react-icons/fa";
import { Typography, Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const iconMap = {
  "Web Development": FaCode,
  "App Development": FaCode,
  "Software Development": FaCode,
  Marketing: FaBullhorn,
  "Data Science": FaChartBar,
  Design: FaPaintBrush,
  Accounting: FaCalculator,
  "Human Resources": FaUsers,
  Sales: FaDollarSign,
  "Customer Support": FaHeadset,
};

export default function CategoriesSection({ categories }) {
  const theme = useTheme();

  // Convert your API array into a usable category list
  const formattedCategories = categories?.map(cat => cat.name) || [];

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" color="textPrimary" fontWeight={600}>
        Browse by Category
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
        Find jobs that match your skills.
      </Typography>

      <Box
        sx={{
          mt: 2.5,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {formattedCategories.map((cat) => {
          const Icon = iconMap[cat] || FaBriefcase;

          return (
            <Button
              key={cat}
              sx={{
                display: "flex",
                alignItems: "center",
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
                py: 1.5,
                textTransform: "none",
                justifyContent: "flex-start",
                boxShadow: 1,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(37, 99, 235, 0.1)"
                      : theme.palette.action.hover,
                  boxShadow: 3,
                },
                transition: "all 0.3s",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "#1e293b"
                      : theme.palette.grey[200],
                  color: theme.palette.primary.main,
                  transition: "all 0.3s",
                  ".MuiButton-root:hover &": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                  },
                }}
              >
                <Icon size={18} />
              </Box>

              <Typography
                variant="body2"
                fontWeight={500}
                color="textPrimary"
                sx={{ flex: 1, textAlign: "left" }}
              >
                {cat}
              </Typography>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
