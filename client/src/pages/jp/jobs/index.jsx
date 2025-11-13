import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Drawer,
  Button,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const token = getToken();
  const [totalJobs, setTotalJobs] = useState(0);


  const [filters, setFilters] = useState({
    experience_level: [],
    employment_mode: [],
    job_type: [],
    salary_min: 0,
    salary_max: 200000,
    skill_level: "",
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // --------------------------
  // Fetch Jobs
  // --------------------------
const fetchJobs = async () => {
  try {
    const params = {};

    if (filters.experience_level.length > 0)
      params.experience_level = filters.experience_level;

    if (filters.employment_mode.length > 0)
      params.employment_mode = filters.employment_mode;

    if (filters.job_type.length > 0)
      params.job_type = filters.job_type;

    if (filters.skill_level)
      params.skill_level = filters.skill_level;

    if (filters.salary_min !== 0)
      params.salary_min = filters.salary_min;

    if (filters.salary_max !== 200000)
      params.salary_max = filters.salary_max;

    // Send only selected params
    const res = await apiRequest("/jobs/", "GET", token, null, params);

    setJobs(res.jobs);
    setTotalJobs(res.count);
  } catch (err) {
    console.log("Jobs Load Error", err);
  }
};


  useEffect(() => {
    fetchJobs();
  }, [filters]);

  // --------------------------
  // Open Drawer with job details
  // --------------------------
  const openJobDrawer = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };


  // --------------------------
  // Job Card Component
  // --------------------------
  const JobCard = ({ job }) => (
    <Card
      onClick={() => openJobDrawer(job)}
      sx={{
        mb: 2,
        border: "1px solid #333",
        cursor: "pointer",
        background: "#111",
        transition: "0.2s",
        "&:hover": { borderColor: "#00e676" },
      }}
    >
      <CardContent>
        <Typography variant="h6" color="#00e676">
          {job.title}
        </Typography>

        <Typography fontSize={13} color="gray">
          {job.company_info?.company_name || "Unknown Company"}
        </Typography>

        <Box mt={1} display="flex" gap={1}>
          {job.required_skills?.slice(0, 5).map((skill, i) => (
            <Chip
              key={i}
              label={skill.name}
              size="small"
              sx={{
                background: "#222",
                color: "#00e676",
                border: "1px solid #333",
                fontSize: "11px",
              }}
            />
          ))}
        </Box>

        <Typography mt={1} fontSize={14} color="gray">
          📍 {job.location}
        </Typography>

        <Typography mt={1} fontSize={13} color="#ccc">
          {job.description?.slice(0, 140)}...
        </Typography>
      </CardContent>
    </Card>
  );

  // --------------------------
  // Drawer Component
  // --------------------------
  const JobDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      transitionDuration={700}
      SlideProps={{ timeout: 700 }}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "60%" },
          bgcolor: "#111",
          color: "#fff",
          p: 3,
          boxShadow: "0px 0px 20px rgba(0,0,0,0.5)",
          transition: "all 0.7s ease-in-out",
        },
      }}
    >
      {/* Close Button */}
      <Box
        onClick={() => setDrawerOpen(false)}
        sx={{
          position: "absolute",
          top: 15,
          right: 15,
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: "50%",
          background: "#222",
          border: "1px solid #444",
          color: "#fff",
          fontSize: "18px",
          transition: "0.2s",
          "&:hover": { background: "#333", transform: "scale(1.1)" },
        }}
      >
        ✕
      </Box>
      {selectedJob && (
        <Box>

          <Typography variant="h5" color="#00e676">
            {selectedJob.title}
          </Typography>

          <Typography mt={1} fontSize={14} color="gray">
            {selectedJob.company_info?.company_name}
          </Typography>

          <Divider sx={{ my: 2, borderColor: "#444" }} />

          {/* Skills */}
          <Typography fontWeight="bold" mb={1}>
            Required Skills:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {selectedJob.required_skills?.map((skill) => (
              <Chip
                key={skill.id}
                label={skill.name}
                size="small"
                sx={{ background: "#222", color: "#0f0", border: "1px solid #333" }}
              />
            ))}
          </Box>

          {/* Work Details */}
          <Typography mb={1}><b>Location:</b> {selectedJob.location}</Typography>
          <Typography mb={1}><b>Employment Mode:</b> {selectedJob.employment_mode.join(", ")}</Typography>
          <Typography mb={1}><b>Job Type:</b> {selectedJob.job_type.join(", ")}</Typography>
          <Typography mb={1}><b>Experience:</b> {selectedJob.experience_level.join(", ")}</Typography>

          {/* Salary */}
          <Typography mt={2}>
            <b>Salary:</b> {selectedJob.salary_min} - {selectedJob.salary_max} {selectedJob.salary_currency}
          </Typography>

          {/* Deadline */}
          <Typography mt={1}><b>Deadline:</b> {selectedJob.deadline}</Typography>

          <Divider sx={{ my: 2, borderColor: "#444" }} />

          {/* Description */}
          <Typography fontWeight="bold">Job Description:</Typography>
          <Typography mt={1} fontSize={14} color="#ccc" sx={{ whiteSpace: "pre-line" }}>
            {selectedJob.description}
          </Typography>

          <Box mt={3} textAlign="center">
            <Button variant="contained" color="success" fullWidth>
              Apply Now
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );


  const userInfo = useSelector((state) => state.userInfo.userInfo);

  console.log(userInfo?.roles)

if (userInfo?.roles.includes("Company")) {
    const can_create = true;
}


  return (
    <>
      <Grid container spacing={2} p={2} minHeight="100vh">
        {/* ----------------- LEFT FILTERS ----------------- */}
        <Grid item xs={3}>
          <Box sx={{ background: "#111", p: 2, borderRadius: 2, border: "1px solid #333" }}>

            <Typography variant="h6" color="#fff">Filters</Typography>
            <Divider sx={{ my: 2, borderColor: "#444" }} />

            {/* EXPERIENCE */}
            <Accordion sx={{ background: "#111", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Experience Level</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {["Fresher", "Junior", "Mid", "Senior", "Lead"].map((lvl) => (
                  <Chip
                    key={lvl}
                    label={lvl}
                    onClick={() => toggleFilter("experience_level", lvl)}
                    sx={{
                      m: 0.5,
                      background: filters.experience_level.includes(lvl) ? "#0f0" : "#222",
                      color: filters.experience_level.includes(lvl) ? "#000" : "#0f0",
                    }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* EMPLOYMENT MODE */}
            <Accordion sx={{ background: "#111", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Employment Mode</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {["Remote", "Hybrid", "On-site"].map((mode) => (
                  <Chip
                    key={mode}
                    label={mode}
                    onClick={() => toggleFilter("employment_mode", mode)}
                    sx={{
                      m: 0.5,
                      background: filters.employment_mode.includes(mode) ? "#0f0" : "#222",
                      color: filters.employment_mode.includes(mode) ? "#000" : "#0f0",
                    }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* JOB TYPES */}
            <Accordion sx={{ background: "#111", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Job Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {["Internship", "Part-time", "Full-time", "Freelance", "Contract"].map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    onClick={() => toggleFilter("job_type", type)}
                    sx={{
                      m: 0.5,
                      background: filters.job_type.includes(type) ? "#0f0" : "#222",
                      color: filters.job_type.includes(type) ? "#000" : "#0f0",
                    }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

            {/* SALARY RANGE */}
            <Accordion sx={{ background: "#111", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Salary Range</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="#0f0">BDT {filters.salary_min} - {filters.salary_max}</Typography>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={filters.salary_min}
                  onChange={(e) => setFilters({ ...filters, salary_min: e.target.value })}
                  style={{ width: "100%", marginTop: "10px" }}
                />
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={filters.salary_max}
                  onChange={(e) => setFilters({ ...filters, salary_max: e.target.value })}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              </AccordionDetails>
            </Accordion>

            {/* SKILL LEVEL */}
            {/* <Accordion sx={{ background: "#111", color: "#fff" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Skill Level</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {["novice", "beginner", "intermediate", "skilled", "advanced", "expert", "master"].map((lvl) => (
                  <Chip
                    key={lvl}
                    label={lvl}
                    onClick={() => setFilters({ ...filters, skill_level: lvl })}
                    sx={{
                      m: 0.5,
                      background: filters.skill_level === lvl ? "#0f0" : "#222",
                      color: filters.skill_level === lvl ? "#000" : "#0f0",
                    }}
                  />
                ))}
              </AccordionDetails>
            </Accordion> */}

          </Box>
        </Grid>


        {/* ----------------- MIDDLE JOB LIST ----------------- */}
        <Grid item xs={6}>
          <Typography variant="h5" color="#fff" mb={2}>
            All Jobs {totalJobs > 0 && `(${totalJobs})`}
          </Typography>

          {jobs && jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </Grid>

        {/* ----------------- RIGHT SIDEBAR ----------------- */}
        <Grid item xs={3}>
          <Box sx={{ background: "#111", p: 2, borderRadius: 2, border: "1px solid #333" }}>
            <Typography variant="h6" color="#fff">
              Matched Jobs
            </Typography>

            <Typography color="gray" fontSize={13} mt={1}>
              No matched jobs yet.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Drawer */}
      <JobDrawer />
    </>
  );
}
