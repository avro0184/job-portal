import { Paper, Typography, Button, Stack, Box } from "@mui/material";

export default function CareerBot() {
  const suggestions = [
    "What job fits me?",
    "What should I learn next?",
    "Improve my CV"
  ];

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: "background.paper", borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
        Ask CareerBot
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
        Quick Suggestions:
      </Typography>

      <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
        {suggestions.map((suggestion, idx) => (
          <Button
            key={idx}
            variant="outlined"
            sx={{ 
              justifyContent: "flex-start", 
              textTransform: "none",
              color: "text.primary",
              borderColor: "divider"
            }}
          >
            • {suggestion}
          </Button>
        ))}
      </Stack>
      <Button variant="contained" color="primary" sx={{ mt: 3, width: "100%" }}>
        Open Chat →
      </Button>
    </Paper>
  );
}
