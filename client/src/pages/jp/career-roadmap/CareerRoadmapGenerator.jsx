// src/components/ai/CareerRoadmapGenerator.jsx
import { useState, useMemo, useRef } from "react";
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
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import SchoolIcon from "@mui/icons-material/School";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SaveIcon from "@mui/icons-material/Save";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function parseSkills(text) {
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// 🔧 same generateRoadmap from above, pasted here
function generateRoadmap({ skills, targetRole, timeframeMonths, weeklyHours }) {
  const months = timeframeMonths || 3;
  const phases = [];

  const role = (targetRole || "").toLowerCase();

  const isFrontend = role.includes("front");
  const isData = role.includes("data");
  const isBackend = role.includes("back");

  const basePhaseCount = months <= 2 ? 3 : months <= 4 ? 4 : 5;
  const weeksPerPhase = Math.max(2, Math.round((months * 4) / basePhaseCount));

  const labelPhase = (i) =>
    `Phase ${i + 1} (Weeks ${i * weeksPerPhase + 1}–${(i + 1) * weeksPerPhase})`;

  const frontendPhases = [
    {
      topics: ["HTML semantics", "CSS layout (Flexbox/Grid)", "Modern JavaScript (ES6+)"],
      projects: ["Rebuild a landing page from a Dribbble shot"],
    },
    {
      topics: ["React basics", "Components & props", "State & effects"],
      projects: ["Create a multi-page portfolio site using React"],
    },
    {
      topics: ["Styling with Tailwind or MUI", "Routing (React Router / Next.js basics)"],
      projects: ["Clone a small SaaS marketing site with responsive design"],
    },
    {
      topics: ["API integration (REST)", "Form handling", "Basic authentication"],
      projects: ["Build a job board UI consuming a public API"],
    },
    {
      topics: ["Performance basics", "Deployment (Vercel, Netlify)", "Interview prep"],
      projects: ["Polish portfolio + deploy 2–3 best projects"],
    },
  ];

  const dataPhases = [
    {
      topics: ["Excel/Sheets basics", "Intro to Python", "Data types & loops"],
      projects: ["Analyze a simple CSV dataset (sales or marks)"],
    },
    {
      topics: ["Pandas basics", "Data cleaning", "Exploratory data analysis"],
      projects: ["Clean and summarize a Kaggle dataset"],
    },
    {
      topics: ["Data visualization (Matplotlib/Seaborn)", "Basic statistics"],
      projects: ["Create 3–4 charts that tell a story from data"],
    },
    {
      topics: ["SQL basics", "Joins & aggregations"],
      projects: ["Design queries for a sample e-commerce DB"],
    },
    {
      topics: ["Portfolio building", "Case study writing", "Interview prep"],
      projects: ["Publish a data case study on GitHub/LinkedIn"],
    },
  ];

  const backendPhases = [
    {
      topics: ["Language basics (Node.js/JS or Python)", "HTTP fundamentals"],
      projects: ["Build a simple CLI or script project"],
    },
    {
      topics: ["REST APIs", "Express / Django basics"],
      projects: ["Create CRUD API for a todo app"],
    },
    {
      topics: ["Databases (MongoDB/Postgres)", "ORM/ODM basics"],
      projects: ["Add database persistence to your API"],
    },
    {
      topics: ["Authentication", "Environment variables", "Error handling"],
      projects: ["Secure and deploy your API"],
    },
    {
      topics: ["System design basics", "Interview preparation"],
      projects: ["Write documentation & diagrams for your project"],
    },
  ];

  const template = isFrontend
    ? frontendPhases
    : isData
    ? dataPhases
    : isBackend
    ? backendPhases
    : frontendPhases;

  for (let i = 0; i < basePhaseCount; i++) {
    const tpl = template[i] || template[template.length - 1];
    phases.push({
      title: labelPhase(i),
      topics: tpl.topics,
      projects: tpl.projects,
      tips:
        weeklyHours && weeklyHours > 0
          ? `Aim for ~${weeklyHours} focused hours per week. Review progress at the end of each phase.`
          : "Stay consistent, review weekly, and track your progress.",
    });
  }

  const applyFromPhaseIndex =
    basePhaseCount <= 3 ? basePhaseCount - 1 : basePhaseCount - 2;
  const applyFromPhase = phases[applyFromPhaseIndex];

  const applySuggestion = applyFromPhase
    ? `Start applying for internships and entry-level roles around ${applyFromPhase.title}. By then, you should have at least 1–2 solid projects and a polished CV/portfolio.`
    : "Once you complete most phases and have 2+ projects, start applying for internships and junior roles.";

  return {
    targetRole,
    timeframeMonths: months,
    weeklyHours,
    phases,
    applyFromPhaseIndex,
    applySuggestion,
    summary: `Roadmap for ${targetRole || "your target role"} over ${months} month(s), based on your current skills: ${
      skills.length ? skills.join(", ") : "not specified"
    }.`,
  };
}

export default function CareerRoadmapGenerator() {
  const [skillsText, setSkillsText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timeframe, setTimeframe] = useState(3);
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [roadmap, setRoadmap] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const parsedSkills = useMemo(() => parseSkills(skillsText), [skillsText]);
  const roadmapRef = useRef(null);

  const handleGenerate = () => {
    const plan = generateRoadmap({
      skills: parsedSkills,
      targetRole,
      timeframeMonths: timeframe,
      weeklyHours,
    });
    setRoadmap(plan);
    setCopied(false);
  };

  // 📁 Save roadmap for logged-in user (stub for now)
  const handleSave = async () => {
    if (!roadmap) return;
    try {
      setSaving(true);
      await fetch("/api/roadmap/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roadmap),
      });
      // you can show a toast or snackbar here
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // 📋 Copy roadmap text
  const handleCopy = async () => {
    if (!roadmap) return;
    const textLines = [
      roadmap.summary,
      "",
      "When to start applying:",
      roadmap.applySuggestion,
      "",
      ...roadmap.phases.flatMap((phase) => [
        `=== ${phase.title} ===`,
        `Topics: ${phase.topics.join(", ")}`,
        `Projects: ${phase.projects.join("; ")}`,
        `Tip: ${phase.tips}`,
        "",
      ]),
    ];
    const text = textLines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // 🧾 Simple "download as PDF" using browser print (user can save as PDF)
  const handlePrint = () => {
    if (!roadmapRef.current) return;
    const printContents = roadmapRef.current.innerHTML;
    const win = window.open("", "PRINT", "height=600,width=800");
    if (!win) return;
    win.document.write("<html><head><title>Career Roadmap</title></head><body>");
    win.document.write(printContents);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* Input form */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid rgba(255,255,255,0.08)",
          mb: 4,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TimelineIcon color="primary" />
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Generate Your Career Roadmap
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Provide your current skillset and target role. We&apos;ll create a
          phase-based learning plan with project ideas and a suggested time to
          start applying for internships or jobs.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Current skills (comma or line separated)"
            placeholder="Example: HTML, CSS, JavaScript, React"
            multiline
            minRows={3}
            fullWidth
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
          />

          <TextField
            label="Target role"
            placeholder="e.g., Frontend Developer, Data Analyst"
            fullWidth
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Timeframe (months)
              </Typography>
              <Select
                fullWidth
                size="small"
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                sx={{ mt: 0.5 }}
              >
                <MenuItem value={2}>2 months</MenuItem>
                <MenuItem value={3}>3 months</MenuItem>
                <MenuItem value={4}>4 months</MenuItem>
                <MenuItem value={6}>6 months</MenuItem>
              </Select>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Available learning time per week (hours)
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                <Slider
                  value={weeklyHours}
                  onChange={(_, v) => setWeeklyHours(v)}
                  min={4}
                  max={30}
                  step={2}
                  sx={{ flex: 1 }}
                />
                <Typography variant="body2" sx={{ width: 36, textAlign: "right" }}>
                  {weeklyHours}h
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {parsedSkills.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Detected skills:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {parsedSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ pt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerate}
              startIcon={<RocketLaunchIcon />}
            >
              Generate roadmap
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Roadmap output */}
      {roadmap && (
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <SchoolIcon color="primary" />
              <Typography variant="h6" sx={{ color: "text.primary" }}>
                Your Learning Roadmap
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy text"}
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handlePrint}
              >
                Download PDF
              </Button>
            </Stack>
          </Stack>

          <div ref={roadmapRef}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {roadmap.summary}
            </Typography>

            {/* When to start applying */}
            <Paper
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid rgba(56,189,248,0.4)",
              }}
            >
              <Typography variant="subtitle2" color="primary.main">
                When should you start applying?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {roadmap.applySuggestion}
              </Typography>
            </Paper>

            {/* Phases */}
            <Stack spacing={2}>
              {roadmap.phases.map((phase, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    border: "1px solid rgba(148,163,184,0.3)",
                  }}
                >
                  <Typography variant="subtitle2" color="primary.main">
                    {phase.title}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>
                    Topics:
                  </Typography>
                  <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                    {phase.topics.map((t) => (
                      <li key={t}>
                        <Typography variant="body2" color="text.secondary">
                          {t}
                        </Typography>
                      </li>
                    ))}
                  </ul>

                  <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>
                    Project idea:
                  </Typography>
                  <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                    {phase.projects.map((p) => (
                      <li key={p}>
                        <Typography variant="body2" color="text.secondary">
                          {p}
                        </Typography>
                      </li>
                    ))}
                  </ul>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1.5, display: "block" }}
                  >
                    Tip: {phase.tips}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </div>
        </Paper>
      )}
    </Box>
  );
}
