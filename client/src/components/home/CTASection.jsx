"use client";
import { Box, Container, Typography, Button } from "@mui/material";

export default function CTA() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1e293b, #0f172a)"
            : "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        
        {/* Heading */}
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ mb: 3, lineHeight: 1.3 }}
        >
          Ready to Start Your Career Journey?
        </Typography>

        {/* Subtext */}
        <Typography
          variant="h6"
          sx={{ mb: 5, opacity: 0.9 }}
        >
          Join thousands of professionals finding new opportunities every day.
        </Typography>

        {/* Button */}
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "white",
            color: "primary.main",
            fontWeight: 700,
            px: 6,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 3,
            "&:hover": {
              backgroundColor: "#f1f5f9",
            },
          }}
        >
          Create Account
        </Button>

      </Container>
    </Box>
  );
}
