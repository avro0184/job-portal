import { Card, Box, Typography, Avatar, Button } from "@mui/material";

export default function RightSidebar() {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Suggestions
      </Typography>

      {/* Suggestion item */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Nafees Salim</Typography>
          <Typography variant="body2" color="text.secondary">
            2.5M followers
          </Typography>
        </Box>
      </Box>

      <Button variant="outlined" size="small" sx={{ textTransform: "none" }}>
        View All
      </Button>
    </Card>
  );
}
