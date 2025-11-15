import { Paper, Typography, Stack, Chip, Box, List, ListItem, ListItemText, Button } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import SchoolIcon from '@mui/icons-material/School';

export default function SkillGapAnalysis({ skills, suggestedCourses }) {
  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: "background.paper", borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
        Improve Your Profile
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <WarningIcon sx={{ fontSize: 18, color: "warning.main" }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Skill Gaps Identified
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {skills?.map((skill, idx) => (
            <Chip 
              key={idx} 
              label={skill.name} 
              color={skill.category === "strong" ? "success" : "warning"} 
              size="small"
              variant={skill.category === "strong" ? "filled" : "outlined"}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <SchoolIcon sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Suggested Courses
          </Typography>
        </Box>

        <List dense sx={{ py: 0 }}>
          {suggestedCourses?.map((course, idx) => (
            <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
              <ListItemText 
                primary={course}
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Button 
        variant="text" 
        color="primary" 
        sx={{ mt: 2, textTransform: "none" }}
      >
        View All Gaps →
      </Button>
    </Paper>
  );
}
