import {
  Modal,
  Fade,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  Box,
  Button,
  CircularProgress
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";

export default function JobMatchModal({ open, onClose, job }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  if (!job) return null;

  const {
    title,
    company_info,
    required_skills = [],
    match = {},
    description,
    responsibilities,
    benefits,
    location,
    job_type,
    employment_mode,
    experience_level,
    salary_min,
    salary_max,
    salary_currency,
  } = job;

  const {
    final_score,
    skill_score,
    matched_skills = [],
    missing_skills = []
  } = match;

  const analyzeWithAI = async () => {
    try {
      setLoading(true);

      const response = await apiRequest(
        "/jobs/skillflow/",
        "POST",
        token,
        { job }   // <-- simply send the job object
      );

      // Save the entire response so the frontend can display all AI results
      setAiResponse(response);
    } catch (err) {
      setAiResponse({ error: "Failed to analyze with AI." });
    } finally {
      setLoading(false);
    }
  };
  

  // useEffect(() => {
  //   const jobMatchFromDb = async () => {
  //     const response = await apiRequest(`skillflow/`, "POST", token, { job })
  //   }

  //   jobMatchFromDb()
  // },[])


  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Paper className="no-scrollbar"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "60%" },
            maxHeight: "90vh",
            overflowY: "auto",
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 3
          }}
        >
          {/* Header */}
          <Stack direction="row" spacing={2} alignItems="center">
            <WorkOutlineIcon color="primary" />
            <Box>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {company_info?.company_name}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Match Score */}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Match Score: {final_score}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={final_score}
            sx={{ mt: 1, height: 10, borderRadius: 2 }}
          />

          {/* Job Info */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Job Details</Typography>
            <Typography variant="body2" color="text.secondary">
              Location: {location}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Type: {job_type.join(", ")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Mode: {employment_mode.join(", ")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Experience: {experience_level.join(", ")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Salary: {salary_min}–{salary_max} {salary_currency}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Required Skills */}
          <Typography variant="subtitle2">Required Skills</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {required_skills.map((s) => (
              <Chip key={s.id} label={s.name} size="small" />
            ))}
          </Stack>

          {/* Matched Skills */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="primary.main">
              Matched Skills
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {matched_skills.map((m) => (
                <Chip
                  key={m.skill}
                  label={m.skill}
                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  size="small"
                  color="success"
                />
              ))}
            </Stack>
          </Box>

          {/* Missing Skills */}
          {missing_skills.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="error.main">
                Missing Skills
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                {missing_skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    icon={<CancelIcon sx={{ fontSize: 14 }} />}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Description */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Job Description</Typography>
            <Typography variant="body2" color="text.secondary">
              {description || "No description provided."}
            </Typography>
          </Box>

          {/* AI Analysis Output */}
          {aiResponse && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              {/* Title */}
              <Typography variant="h6" sx={{ color: "#673ab7", fontWeight: 700 }}>
                🔍 AI Job Match Analysis
              </Typography>

              {/* Main Summary */}
              {aiResponse.ai_summary && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    🧠 Summary
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {aiResponse.ai_summary}
                  </Typography>
                </Box>
              )}

              {/* Skill Flow */}
              {aiResponse.skill_flow && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    🚀 Skill Flow Roadmap
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                    }}
                  >
                    {aiResponse.skill_flow}
                  </Typography>
                </Box>
              )}

              {/* Resources */}
              {aiResponse.resources && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    📚 Learning Resources
                  </Typography>

                  {Object.keys(aiResponse.resources).map((skill) => (
                    <Box
                      key={skill}
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        🔧 {skill}
                      </Typography>

                      {aiResponse.resources[skill].map((res, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: "#673ab7",
                              borderRadius: "50%",
                              mr: 1.2,
                            }}
                          />
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: "0.85rem",
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
                          >
                            {res.title}
                          </a>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}


          {/* Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" onClick={analyzeWithAI}>
              {loading ? <CircularProgress size={22} /> : "Analyze with AI"}
            </Button>

            <Button variant="contained" color="error" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  );
}
