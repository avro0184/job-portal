"use client";
import { Box, Container, Grid, Card, CardContent, Typography, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const features = [
  {
    title: "Smart Search",
    desc: "Quickly find jobs matching your skills and interests.",
    icon: <SearchIcon fontSize="large" />,
  },
  {
    title: "Top Companies",
    desc: "Work with trusted companies hiring worldwide.",
    icon: <WorkIcon fontSize="large" />,
  },
  {
    title: "Easy Apply",
    desc: "Apply to jobs instantly and track your progress.",
    icon: <FlashOnIcon fontSize="large" />,
  },
];

export default function Features() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.900" : "grey.50",
      }}
    >
      <Container maxWidth="lg">
        
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          sx={{
            mb: 8,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Why Choose Us?
        </Typography>

        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  textAlign: "center",
                  p: 2,
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>

                  {/* Icon */}
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 70,
                      height: 70,
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    {f.icon}
                  </Avatar>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    {f.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: "1rem" }}
                  >
                    {f.desc}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}
