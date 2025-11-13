import { Card, Avatar, Typography, Box, Divider } from "@mui/material";

export default function LeftSidebar() {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />

      <Typography align="center" variant="h6" sx={{ fontWeight: 600 }}>
        Your Name
      </Typography>

      <Typography align="center" color="text.secondary">
        Student • Web Developer
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Profile views <strong>12</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
          Saved items
        </Typography>
      </Box>
    </Card>
  );
}
