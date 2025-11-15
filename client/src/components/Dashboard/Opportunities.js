import { Paper, Typography, Stack, Box, Chip, Button } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Opportunities({ opportunities }) {
  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: "background.paper", borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
        Opportunities Near You
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, mb: 2 }}>
        <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Based on your location: Dhaka, BD
        </Typography>
      </Box>

      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        {opportunities.map((opp, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Chip 
              label={opp.type}
              size="small"
              color={opp.color || "default"}
              sx={{ minWidth: 80 }}
            />
            <Typography variant="body2" sx={{ color: "text.primary", flex: 1 }}>
              {opp.title}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Button 
        variant="text" 
        color="primary" 
        sx={{ mt: 2, textTransform: "none" }}
      >
        Browse More →
      </Button>
    </Paper>
  );
}
