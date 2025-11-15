"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Slider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";

export default function HomeJobsSection() {
  const token = getToken();

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);

  const [filters, setFilters] = useState({
    experience_level: [],
    employment_mode: [],
    job_type: [],
    salary_min: 0,
    salary_max: 200000,
  });

  // OPTIONS
  const EXPERIENCE = ["Fresher", "Junior", "Mid", "Senior", "Lead"];
  const EMPLOYMENT = ["Remote", "Hybrid", "On-site"];
  const JOB_TYPES = ["Internship", "Part-time", "Full-time", "Freelance", "Contract"];

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const params = {};

      Object.keys(filters).forEach((key) => {
        const val = filters[key];
        if (Array.isArray(val) && val.length > 0) params[key] = val;
        else if (!Array.isArray(val)) params[key] = val;
      });

      const res = await apiRequest("/jobs/", "GET", token, null, params);

      setJobs(res.jobs);
      setTotalJobs(res.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const toggleFilterArray = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // -------------------------
  // JOB CARD (compact design)
  // -------------------------
  const JobCard = ({ job }) => (
    <Card
      sx={{
        borderRadius: 3,
        mb: 2,
        cursor: "pointer",
        border: (theme) =>
          theme.palette.mode === "dark"
            ? "1px solid #333"
            : "1px solid rgba(0,0,0,0.15)",
        background: (theme) =>
          theme.palette.mode === "dark" ? "#111" : "#fff",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          borderColor: "#00e676",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" color="primary">
          {job.title}
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          {job.company_info?.company_name || "Unknown Company"}
        </Typography>

        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {job.required_skills?.slice(0, 4).map((skill, i) => (
            <Chip
              key={i}
              label={skill.name}
              size="small"
              sx={{
                fontSize: "11px",
                background: "rgba(0,255,150,0.1)",
                color: "#00e676",
                border: "1px solid rgba(0,255,150,0.3)",
              }}
            />
          ))}
        </Box>

        <Typography mt={1} fontSize={14} color="text.secondary">
          📍 {job.location}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        py: 10,
        background: (theme) =>
          theme.palette.mode === "dark" ? "#0a0a0a" : "#f5f5f5",
      }}
    >
      <Grid container spacing={4} maxWidth="lg" mx="auto">
        {/* LEFT FILTER PANEL */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              borderRadius: 3,
              p: 2,
              background: (theme) =>
                theme.palette.mode === "dark" ? "#111" : "#fff",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid #333"
                  : "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" mb={2}>
              Filter Jobs
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* EXPERIENCE */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Experience Level</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {EXPERIENCE.map((lvl) => (
                  <FormControlLabel
                    key={lvl}
                    control={
                      <Checkbox
                        checked={filters.experience_level.includes(lvl)}
                        onChange={() => toggleFilterArray("experience_level", lvl)}
                      />
                    }
                    label={lvl}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* EMPLOYMENT */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Employment Mode</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {EMPLOYMENT.map((mode) => (
                  <FormControlLabel
                    key={mode}
                    control={
                      <Checkbox
                        checked={filters.employment_mode.includes(mode)}
                        onChange={() => toggleFilterArray("employment_mode", mode)}
                      />
                    }
                    label={mode}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* JOB TYPES */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Job Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {JOB_TYPES.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={filters.job_type.includes(type)}
                        onChange={() => toggleFilterArray("job_type", type)}
                      />
                    }
                    label={type}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* SALARY */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Salary Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography mb={2}>
                  BDT {filters.salary_min} - {filters.salary_max}
                </Typography>

                <Slider
                  value={[filters.salary_min, filters.salary_max]}
                  min={0}
                  max={200000}
                  step={1000}
                  onChange={(e, v) =>
                    setFilters({
                      ...filters,
                      salary_min: v[0],
                      salary_max: v[1],
                    })
                  }
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* JOB LIST */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" mb={3}>
            Latest Jobs ({totalJobs})
          </Typography>

          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          {jobs.length === 0 && (
            <Typography color="text.secondary" mt={5}>
              No jobs match your filters.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
