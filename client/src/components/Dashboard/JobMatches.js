import { Paper, Typography, Stack, Chip, Button, Box } from "@mui/material";

export default function JobMatches({ job }) {
  if (!job) return null;

  const company = job.company_info?.company_name || "Unknown Company";
  const score = job.match?.final_score || 0;
  const matched = job.match?.matched_skills || [];
  const missing = job.match?.missing_skills || [];

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* Job Title + Company */}
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {job.title}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        {company} • {job.location}
      </Typography>

      {/* Match Score */}
      <Box sx={{ my: 2 }}>
        <Chip
          label={`Match Score: ${score}%`}
          color={score > 60 ? "success" : score > 30 ? "warning" : "error"}
        />
      </Box>

      {/* Matched Skills */}
      {matched?.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Matched Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {matched.map((skill, index) => (
              <Chip
                key={index}
                label={skill.skill}
                color="primary"
                size="small"
              />
            ))}
          </Stack>
        </>
      )}

      {/* Missing Skills */}
      {missing?.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Missing Skills:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {missing.map((skill, i) => (
              <Chip key={i} label={skill} size="small" color="warning" />
            ))}
          </Stack>
        </>
      )}

      {/* Apply button */}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        color="primary"
      >
        Apply Now
      </Button>
    </Paper>
  );
}
