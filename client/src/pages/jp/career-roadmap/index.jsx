"use client";

import { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Card, CardContent, Chip, Button,
  Modal, Paper, Stack, Box, Divider, Accordion, AccordionSummary,
  AccordionDetails, Checkbox
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { useRouter } from "next/router";

// =======================================================
//      FULL SINGLE PAGE — Roadmap + Modal + Phase Item
// =======================================================

export default function CareerRoadmapPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [open, setOpen] = useState(false);
  const token = getToken();

  // Fetch all roadmaps
  const getRoadmaps = async () => {
    try {
      const res = await apiRequest("career-roadmap/", "GET", token);
      setRoadmaps(res?.roadmaps|| []);
    } catch (err) {
      console.error("Roadmap list error:", err);
    }
  };

  useEffect(() => {
    getRoadmaps();
  }, []);

  // -----------------------------------------------------
  // Phase Update Function (checkbox toggle)
  // -----------------------------------------------------
  const togglePhase = async (phase) => {
    try {
      const token = localStorage.getItem("access_token");

      await apiRequest(
        `/roadmap/phase/${phase.id}/update/`,
        "PATCH",
        token,
        { is_completed: !phase.is_completed }
      );

      getRoadmaps(); // refresh UI
    } catch (err) {
      console.error("Phase update failed:", err);
    }
  };

  // -----------------------------------------------------
  // Status Helpers
  // -----------------------------------------------------
  const getStatusIcon = (phase) =>
    phase.is_completed ? (
      <CheckCircleIcon sx={{ color: "success.main" }} />
    ) : (
      <RadioButtonUncheckedIcon sx={{ color: "text.disabled" }} />
    );

  const getPhaseChip = (phase) => (
    <Chip
      label={phase.is_completed ? "Completed" : "Pending"}
      size="small"
      color={phase.is_completed ? "success" : "default"}
      sx={{ mt: 0.5 }}
    />
  );

  // -----------------------------------------------------
  // Modal Component Render
  // -----------------------------------------------------
  const renderModal = () => {
    if (!selectedRoadmap) return null;

    const phases = selectedRoadmap?.roadmap_data?.phases || [];

    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="no-scrollbar"
          sx={{
            width: "80%",
            maxHeight: "90vh",
            overflowY: "auto",
            mx: "auto",
            mt: 5,
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              {selectedRoadmap.target_role.toUpperCase()} Roadmap
            </Typography>

            <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
              {selectedRoadmap.timeframe_months} months • {selectedRoadmap.weekly_hours} hrs/week
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedRoadmap.roadmap_data.summary}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* PHASE LIST */}
            <Stack spacing={2}>
              {phases.map((phase) => (
                <Accordion key={phase.id} sx={{ borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Checkbox
                        checked={phase.is_completed}
                        onChange={() => togglePhase(phase)}
                        color="primary"
                      />

                      {getStatusIcon(phase)}

                      <Box>
                        <Typography fontWeight={600}>{phase.title}</Typography>
                        {getPhaseChip(phase)}
                        <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                          Duration: {phase.duration_weeks} weeks
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography sx={{ fontWeight: 600 }}>Tips</Typography>
                    <Typography sx={{ mb: 2 }}>{phase.tips}</Typography>

                    <Typography sx={{ fontWeight: 600 }}>Topics</Typography>
                    {phase.topics.map((t, i) => (
                      <Typography key={i} sx={{ ml: 2 }}>• {t}</Typography>
                    ))}

                    <Typography sx={{ fontWeight: 600, mt: 2 }}>Projects</Typography>
                    {phase.projects.map((p, i) => (
                      <Typography key={i} sx={{ ml: 2 }}>• {p}</Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
    
          </Paper>
        </Box>
      </Modal>
    );
  };

  const router = useRouter()

  // -----------------------------------------------------
  // MAIN PAGE
  // -----------------------------------------------------
  return (
    <Container sx={{ py: 4 }}>
        <div className="flex justify-between items-center">
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Your Career Roadmaps
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push("/jp/career-roadmap/genereate-roadmap")}>Create New Roadmap</Button>
        </div>

      <Grid container spacing={3}>
        {roadmaps.map((rm) => (
          <Grid item xs={12} md={6} key={rm.id}>
            <Card
              onClick={() => {
                setSelectedRoadmap(rm);
                setOpen(true);
              }}
              sx={{
                cursor: "pointer",
                p: 2,
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {rm.target_role}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                  {rm.timeframe_months} months • {rm.weekly_hours} hrs/week
                </Typography>

                <Chip label={`${rm.roadmap_data.phases.length} Phases`} />

                <Typography variant="body2" sx={{ mt: 2 }}>
                  {rm.roadmap_data.summary.slice(0, 140)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {renderModal()}
    </Container>
  );
}
