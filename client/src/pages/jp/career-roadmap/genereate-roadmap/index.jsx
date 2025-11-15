// src/components/ai/CareerRoadmapGenerator.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Slider,
  Button,
  Stack,
  Chip,
  Checkbox,
  Grid,
} from "@mui/material";

import TimelineIcon from "@mui/icons-material/Timeline";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";

function parseSkills(text) {
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function CareerRoadmapGenerator() {
  const token = getToken();

  const [targetRole, setTargetRole] = useState("");
  const [timeframe, setTimeframe] = useState(3);
  const [weeklyHours, setWeeklyHours] = useState(10);

  const [skillsText, setSkillsText] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const roadmapRef = useRef(null);

  /* -----------------------------
    Load User Skills
  ----------------------------- */
  useEffect(() => {
    if (!token) return;
    (async () => {
      const response = await apiRequest("/user/skills/", "GET", token);
      if (response.success) setUserSkills(response.data);
    })();
  }, [token]);

  /* Combine selected + manual skills */
  const parsedSkills = useMemo(
    () => [...selectedSkills, ...parseSkills(skillsText)],
    [selectedSkills, skillsText]
  );

  const toggleSkill = (item) => {
    setSelectedSkills((prev) => {
      const exists = prev.find((s) => s.id === item.id);
      return exists ? prev.filter((s) => s.id !== item.id) : [...prev, item];
    });
  };

  /* -----------------------------
      Generate Roadmap (API Call)
  ----------------------------- */
  const handleGenerate = async () => {
    if (!targetRole) return alert("Enter a target role");
    if (parsedSkills.length === 0) return alert("Provide at least 1 skill");

    try {
      setLoading(true);
      setRoadmap(null);
      const payload = {
        skills: parsedSkills,
        target_role: targetRole,
        timeframe_months: timeframe,
        weekly_hours: weeklyHours,
      };

      const response = await apiRequest(
        "career-roadmap/",
        "POST",
        token,
        payload
      );

      if (response.success) {
        setRoadmap(response.roadmap);
      } else {
        alert("Failed to generate roadmap.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while generating roadmap.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
      Copy Roadmap
  ----------------------------- */
  const handleCopy = async () => {
    if (!roadmap) return;

    await navigator.clipboard.writeText(JSON.stringify(roadmap, null, 2));
    alert("Copied to clipboard!");
  };

  /* -----------------------------
      Print / Save as PDF
  ----------------------------- */
  const handlePrint = () => {
    if (!roadmapRef.current) return;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Career Roadmap</title>
        </head>
        <body>${roadmapRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* ---------------------- FORM ---------------------- */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TimelineIcon color="primary" />
          <Typography variant="h6">Career Roadmap Generator</Typography>
        </Stack>

        <Stack spacing={3}>
          {/* -------- User Skills Grid -------- */}
          {userSkills.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Your Skills (select relevant):
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {userSkills.map((item) => {
                  const s = item.skill;
                  const checked = selectedSkills.some((x) => x.id === item.id);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid rgba(0,0,0,0.12)",
                          backgroundColor: checked
                            ? "rgba(37,99,235,0.15)"
                            : "background.paper",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: checked
                              ? "rgba(37,99,235,0.2)"
                              : "rgba(0,0,0,0.04)",
                          },
                        }}
                        onClick={() => toggleSkill(item)}
                      >
                        <Typography fontWeight={600}>{s.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.category?.name} • {s.difficulty_level} •{" "}
                          {item.level}
                        </Typography>

                        <Box
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            background: "rgba(0,0,0,0.12)",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${item.proficiency_percentage}%`,
                              height: "100%",
                              background: "#2563eb",
                            }}
                          />
                        </Box>

                        <Box sx={{ textAlign: "right", mt: 1 }}>
                          <Checkbox checked={checked} size="small" />
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {selectedSkills.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                  {selectedSkills.map((s) => (
                    <Chip
                      key={s.id}
                      label={s.skill.name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Box>
          )}

          <TextField
            label="Additional skills (optional)"
            fullWidth
            multiline
            rows={2}
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
          />

          <TextField
            label="Target Role"
            fullWidth
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption">Timeframe (months)</Typography>
              <Select
                fullWidth
                size="small"
                sx={{ mt: 1 }}
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                {[1, 2, 3, 4, 6].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m} months
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption">Weekly Hours</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Slider
                  value={weeklyHours}
                  onChange={(_, v) => setWeeklyHours(v)}
                  min={4}
                  max={30}
                  step={2}
                  sx={{ flex: 1 }}
                />
                <Typography>{weeklyHours}h</Typography>
              </Stack>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<RocketLaunchIcon />}
            disabled={loading}
            onClick={handleGenerate}
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </Stack>
      </Paper>

      {/* ---------------------- ROADMAP OUTPUT ---------------------- */}
      {roadmap && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <SchoolIcon color="primary" />
              <Typography variant="h6">Your Learning Roadmap</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
              >
                Copy
              </Button>

              <Button
                variant="contained"
                size="small"
                startIcon={<FileDownloadIcon />}
                onClick={handlePrint}
              >
                PDF
              </Button>
            </Stack>
          </Stack>

          <div ref={roadmapRef}>
            <Typography sx={{ mb: 2 }}>{roadmap.summary}</Typography>

            <Paper sx={{ p: 2, mb: 3, borderLeft: "4px solid #2563eb" }}>
              <Typography variant="subtitle2">When to start applying</Typography>
              <Typography>{roadmap.applySuggestion}</Typography>
            </Paper>

            {roadmap.phases?.map((p, i) => (
              <Box key={i} sx={{ p: 2, borderRadius: 2, border: "1px solid #ddd" , mb: 3 }}>
                <Typography variant="subtitle1" color="primary">
                  {p.title}
                </Typography>

                {/* Topics */}
                <Typography sx={{ mt: 1 }}>Topics:</Typography>
                <ul>
                  {p.topics.map((t, idx) => (
                    <li key={idx}>
                      {typeof t === "string" ? (
                        t
                      ) : (
                        <>
                          <strong>{t.name}</strong>
                          {t.details && (
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                              {t.details}
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Projects */}
                <Typography sx={{ mt: 1 }}>Projects:</Typography>
                <ul>
                  {p.projects.map((pr, idx) => (
                    <li key={idx}>
                      {typeof pr === "string" ? (
                        pr
                      ) : (
                        <>
                          <strong>{pr.name}</strong>
                          {pr.details && (
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                              {pr.details}
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Tip: {p.tips}
                </Typography>
              </Box>
            ))}
          </div>
        </>
      )}
    </Box>
  );
}
