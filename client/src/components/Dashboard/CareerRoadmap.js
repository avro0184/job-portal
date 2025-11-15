import { 
  Paper, Typography, Button, Stack, Box, Chip, 
  LinearProgress, Accordion, AccordionSummary, 
  AccordionDetails, Divider
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function CareerRoadmap({ roadmep = [] }) {

  // ---------------------------------------
  // GET FIRST ROADMAP
  // ---------------------------------------
  const roadmap = roadmep?.[0];
  const phases = roadmap?.roadmap_data?.phases || [];
  const summary = roadmap?.roadmap_data?.summary || "";
  const applySuggestion = roadmap?.roadmap_data?.applySuggestion || "";
  const skills = roadmap?.skills_used || [];
  const role = roadmap?.target_role || "";
  const months = roadmap?.timeframe_months || "";
  const hours = roadmap?.weekly_hours || "";

  // ---------------------------------------
  // STATUS
  // ---------------------------------------
  const getStatus = (phase) => {
    if (phase.is_completed) return "completed";
    return "upcoming";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon sx={{ color: "success.main", fontSize: 22 }} />;
      case "in progress":
        return <AccessTimeIcon sx={{ color: "warning.main", fontSize: 22 }} />;
      default:
        return <RadioButtonUncheckedIcon sx={{ color: "text.disabled", fontSize: 22 }} />;
    }
  };

  const getChipColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "in progress": return "warning";
      default: return "default";
    }
  };

  // ---------------------------------------
  // PROGRESS
  // ---------------------------------------
  const completedCount = phases.filter((p) => p.is_completed).length;
  const progress = phases.length > 0 ? (completedCount / phases.length) * 100 : 0;

  return (
    <Paper 
      sx={{ 
        p: 3, mb: 3, borderRadius: 3, 
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}
    >
      {/* Header */}
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Career Roadmap — {role.toUpperCase()}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {months} months • {hours} hours/week
      </Typography>

      {/* Skills */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {skills.map((s, i) => (
          <Chip key={i} label={s} color="primary" variant="outlined" />
        ))}
      </Box>

      {/* Summary */}
      <Typography sx={{ fontWeight: 600, mt: 2 }}>Summary</Typography>
      <Typography sx={{ whiteSpace: "pre-line", mb: 2 }}>{summary}</Typography>

      {/* Suggestion */}
      <Typography sx={{ fontWeight: 600 }}>AI Suggestion</Typography>
      <Typography sx={{ mb: 2, whiteSpace: "pre-line" }}>{applySuggestion}</Typography>

      <Divider sx={{ my: 2 }} />

      {/* Progress */}
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Overall Progress: {Math.round(progress)}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mt: 1, mb: 2, borderRadius: 1, height: 6 }}
      />

      {/* Phases */}
      <Stack spacing={2}>
        {phases.map((phase) => {
          const status = getStatus(phase);

          return (
            <Accordion key={phase.id} sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {getStatusIcon(status)}

                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {phase.title}
                    </Typography>

                    <Chip
                      label={status === "completed" ? "Completed" : "Upcoming"}
                      color={getChipColor(status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />

                    <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
                      Duration: {phase.duration_weeks} weeks
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Tips</Typography>
                <Typography sx={{ mb: 2 }}>{phase.tips}</Typography>

                <Typography sx={{ fontWeight: 600, mb: 1 }}>Topics</Typography>
                {phase.topics.map((t, i) => (
                  <Typography key={i} sx={{ ml: 2 }}>• {t}</Typography>
                ))}

                <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Projects</Typography>
                {phase.projects.map((p, i) => (
                  <Typography key={i} sx={{ ml: 2 }}>• {p}</Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      {/* Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" fullWidth color="primary">
          View Full Roadmap
        </Button>
        <Button variant="outlined" fullWidth color="primary">
          Download PDF
        </Button>
      </Stack>
    </Paper>
  );
}
