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
  Avatar,
  TextField,
  Slider,
  CircularProgress,
  IconButton,
  Badge,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useTranslate from "@/hooks/useTranslation";
import ApplyModal from "./ApplyModal";
import JobMatchModal from "./JobMatchModal";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const [totalJobs, setTotalJobs] = useState(0);
  const router = useRouter();
  const { t } = useTranslate();
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    experience_level: [],
    employment_mode: [],
    job_type: [],
    salary_min: 0,
    salary_max: 200000,
    skill_level: "",
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const statusColors = {
    Applied: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    Shortlisted: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "Interview Scheduled": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "Interview Completed": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    Offered: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    Rejected: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
    "Not Applied": "linear-gradient(135deg, #868f96 0%, #596164 100%)",
  };

  // --------------------------
  // Fetch Jobs
  // --------------------------
  const fetchJobs = async () => {
    setLoading(true);
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

      const res = await apiRequest("/jobs/", "GET", token, null, params);

      setJobs(res.jobs);
      setTotalJobs(res.count);
    } catch (err) {
      console.log("Jobs Load Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

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

  const clearFilters = () => {
    setFilters({
      experience_level: [],
      employment_mode: [],
      job_type: [],
      salary_min: 0,
      salary_max: 200000,
      skill_level: "",
    });
    setSearchTerm("");
  };

  const activeFilterCount =
    filters.experience_level.length +
    filters.employment_mode.length +
    filters.job_type.length +
    (filters.salary_min !== 0 ? 1 : 0) +
    (filters.salary_max !== 200000 ? 1 : 0);

  // --------------------------
  // Job Card Component
  // --------------------------
  const JobCard = ({ job, onClick }) => {
    const score = job.match?.final_score || 0;

    return (
      <Card
        onClick={onClick}
        sx={{
          mb: 2,
          p: 2,
          cursor: "pointer",
          borderRadius: 3,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          border: "1px solid rgba(103, 84, 232, 0.2)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            border: "1px solid rgba(103, 84, 232, 0.8)",
            transform: "translateY(-6px)",
            boxShadow: "0 12px 24px rgba(103, 84, 232, 0.3)",
          },
          display: "flex",
          gap: 2,
        }}
      >
        {/* Company Logo */}
        <Avatar
          src={process.env.NEXT_PUBLIC_URL_DASHBOARD + job.company_info?.logo}
          variant="rounded"
          sx={{
            width: 70,
            height: 70,
            borderRadius: 2,
            border: "2px solid rgba(103, 84, 232, 0.3)",
            flexShrink: 0,
          }}
        />

        <CardContent sx={{ p: "0 !important", width: "100%" }}>
          {/* Title & Status */}
          <Box display="flex" alignItems="center" gap={1} justifyContent="space-between" mb={1}>
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(135deg, #6754e8 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              {job.title}
            </Typography>
            <Chip
              label={job.job_status || "Not Applied"}
              size="small"
              sx={{
                background: statusColors[job.job_status] || statusColors["Not Applied"],
                color: "#fff",
                fontWeight: 600,
                fontSize: "11px",
              }}
            />
          </Box>

          {/* Company */}
          <Typography fontSize={13} color="#a0aec0" mb={0.5}>
            {job.company_info?.company_name || "Unknown Company"}
          </Typography>

          {/* Match Score */}
          {job.match && score > 0 && (
            <Box display="flex" alignItems="center" gap={0.8} mb={1}>
              <TrendingUpIcon sx={{ fontSize: 16, color: "#f093fb" }} />
              <Typography fontSize={12} color="#f093fb" fontWeight={600}>
                Match: <b>{score}%</b>
              </Typography>
            </Box>
          )}

          {/* Skills */}
          <Box display="flex" flexWrap="wrap" gap={0.8} mb={1}>
            {job.required_skills?.slice(0, 3).map((skill) => (
              <Chip
                key={skill.id}
                label={skill.name}
                size="small"
                sx={{
                  background: "rgba(103, 84, 232, 0.15)",
                  color: "#6754e8",
                  border: "1px solid rgba(103, 84, 232, 0.3)",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              />
            ))}
            {job.required_skills?.length > 3 && (
              <Chip
                label={`+${job.required_skills.length - 3}`}
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#cbd5e0",
                  fontSize: "11px",
                }}
              />
            )}
          </Box>

          {/* Location & Salary */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography fontSize={13} color="#cbd5e0">
              📍 {job.location}
            </Typography>
            <Typography fontSize={13} fontWeight={600} color="#6754e8">
              💰 {job.salary_min}–{job.salary_max}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            mt={1}
            fontSize={12}
            color="#a0aec0"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {job.description || "No description available"}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  // --------------------------
  // Filter Sidebar Component
  // --------------------------
  const FilterSidebar = ({ mobile = false }) => (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(103, 84, 232, 0.2)",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700} color="#fff">
          Filters
        </Typography>
        {activeFilterCount > 0 && (
          <Button
            size="small"
            onClick={clearFilters}
            sx={{ color: "#f093fb", textTransform: "none" }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {mobile && <Divider sx={{ my: 2, borderColor: "rgba(103, 84, 232, 0.2)" }} />}

      {/* Experience Level */}
      <Accordion
        defaultExpanded
        sx={{
          background: "transparent",
          border: "none",
          "&.Mui-expanded": { mb: 1 },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#6754e8" }} />}>
          <Typography fontWeight={600}>Experience</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          {["Fresher", "Junior", "Mid", "Senior", "Lead"].map((lvl) => (
            <Chip
              key={lvl}
              label={lvl}
              onClick={() => toggleFilter("experience_level", lvl)}
              sx={{
                m: 0.5,
                background: filters.experience_level.includes(lvl)
                  ? "linear-gradient(135deg, #6754e8 0%, #764ba2 100%)"
                  : "rgba(103, 84, 232, 0.1)",
                color: filters.experience_level.includes(lvl) ? "#fff" : "#6754e8",
                border: "1px solid rgba(103, 84, 232, 0.3)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Employment Mode */}
      <Accordion sx={{ background: "transparent", border: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#6754e8" }} />}>
          <Typography fontWeight={600}>Employment Mode</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          {["Remote", "Hybrid", "On-site"].map((mode) => (
            <Chip
              key={mode}
              label={mode}
              onClick={() => toggleFilter("employment_mode", mode)}
              sx={{
                m: 0.5,
                background: filters.employment_mode.includes(mode)
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "rgba(240, 147, 251, 0.1)",
                color: filters.employment_mode.includes(mode) ? "#fff" : "#f093fb",
                border: "1px solid rgba(240, 147, 251, 0.3)",
                cursor: "pointer",
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Job Type */}
      <Accordion sx={{ background: "transparent", border: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#6754e8" }} />}>
          <Typography fontWeight={600}>Job Type</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 1 }}>
          {["Internship", "Part-time", "Full-time", "Freelance", "Contract"].map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => toggleFilter("job_type", type)}
              sx={{
                m: 0.5,
                background: filters.job_type.includes(type)
                  ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  : "rgba(79, 172, 254, 0.1)",
                color: filters.job_type.includes(type) ? "#fff" : "#4facfe",
                border: "1px solid rgba(79, 172, 254, 0.3)",
                cursor: "pointer",
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Salary Range */}
      <Accordion sx={{ background: "transparent", border: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#6754e8" }} />}>
          <Typography fontWeight={600}>Salary Range</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2 }}>
          <Typography color="#6754e8" fontWeight={600} mb={2}>
            BDT {filters.salary_min.toLocaleString()} - {filters.salary_max.toLocaleString()}
          </Typography>
          <Slider
            range
            min={0}
            max={200000}
            step={10000}
            value={[filters.salary_min, filters.salary_max]}
            onChange={(e, newValue) =>
              setFilters({
                ...filters,
                salary_min: newValue[0],
                salary_max: newValue[1],
              })
            }
            sx={{
              color: "#6754e8",
              "& .MuiSlider-thumb": {
                backgroundColor: "#6754e8",
                boxShadow: "0 2px 8px rgba(103, 84, 232, 0.4)",
              },
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  console.log(selectedJob)
  // --------------------------
  // Job Drawer Component
  // --------------------------
  const JobDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "90%", md: "50%" },
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#fff",
          p: { xs: 2, md: 3 },
          overflowY: "auto",
        },
      }}
    >
      {selectedJob && (
        <Box>
          {/* Close Button */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: "#fff",
                background: "rgba(103, 84, 232, 0.2)",
                "&:hover": { background: "rgba(103, 84, 232, 0.3)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Header */}
          <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
            <Avatar
              src={process.env.NEXT_PUBLIC_URL_DASHBOARD + selectedJob.company_info?.logo}
              sx={{ width: 80, height: 80, borderRadius: 2, flexShrink: 0 }}
              variant="rounded"
            />
            <Box>
              <Typography
                variant="h5"
                sx={{
                  background: "linear-gradient(135deg, #6754e8 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {selectedJob.title}
              </Typography>
              <Typography fontSize={14} color="#a0aec0">
                {selectedJob.company_info?.company_name}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(103, 84, 232, 0.2)" }} />

          {/* Match Score Section */}
          {selectedJob.match && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                border: "1px solid rgba(103, 84, 232, 0.3)",
                borderRadius: 2,
                background: "rgba(103, 84, 232, 0.05)",
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CircularProgress
                  variant="determinate"
                  value={selectedJob.match.final_score}
                  sx={{ color: "#f093fb" }}
                />
                <Box>
                  <Typography fontWeight={700} color="#f093fb">
                    Match Score
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {selectedJob.match.final_score}%
                  </Typography>
                </Box>
              </Box>

              {/* Matched Skills */}
              {selectedJob.match.matched_skills?.length > 0 && (
                <Box mt={2}>
                  <Typography fontWeight={600} fontSize={13} mb={1} color="#43e97b">
                    ✓ Matched Skills
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedJob.match.matched_skills?.map((s, index) => (
                      <Chip
                        key={index}
                        label={`${s.skill} (${s.level})`}
                        size="small"
                        sx={{
                          background: "rgba(67, 233, 123, 0.15)",
                          color: "#43e97b",
                          border: "1px solid rgba(67, 233, 123, 0.3)",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Missing Skills */}
              {selectedJob.match.missing_skills?.length > 0 && (
                <Box mt={2}>
                  <Typography fontWeight={600} fontSize={13} mb={1} color="#ff6b6b">
                    ✗ Missing Skills
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedJob.match.missing_skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{
                          background: "rgba(255, 107, 107, 0.15)",
                          color: "#ff6b6b",
                          border: "1px solid rgba(255, 107, 107, 0.3)",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenModal(true)}
                sx={{
                  mt: 2,
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  fontWeight: 600,
                }}
              >
                View Analysis
              </Button>
            </Box>
          )}

          {/* Job Details */}
          <Box
            sx={{
              p: 2.5,
              background: "rgba(103, 84, 232, 0.05)",
              borderRadius: 2,
              border: "1px solid rgba(103, 84, 232, 0.2)",
              mb: 3,
            }}
          >
            <Typography fontWeight={700} mb={1.5}>
              Job Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#a0aec0">
                  Location
                </Typography>
                <Typography fontWeight={600}>{selectedJob.location}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#a0aec0">
                  Salary
                </Typography>
                <Typography fontWeight={600} color="#f093fb">
                  {selectedJob.salary_min}–{selectedJob.salary_max}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#a0aec0">
                  Employment
                </Typography>
                <Typography fontWeight={600}>
                  {selectedJob.employment_mode.join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize={12} color="#a0aec0">
                  Type
                </Typography>
                <Typography fontWeight={600}>
                  {selectedJob.job_type.join(", ")}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Required Skills */}
          <Box mb={3}>
            <Typography fontWeight={700} mb={1.5}>
              Required Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedJob.required_skills?.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #6754e8 0%, #764ba2 100%)",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(103, 84, 232, 0.2)" }} />

          {/* Description */}
          <Box mb={3}>
            <Typography fontWeight={700} mb={1}>
              Description
            </Typography>
            <Typography fontSize={14} color="#cbd5e0" sx={{ whiteSpace: "pre-line" }}>
              {selectedJob.description || "No description available"}
            </Typography>
          </Box>

          {/* Responsibilities */}
          {selectedJob.responsibilities && (
            <Box mb={3}>
              <Typography fontWeight={700} mb={1}>
                Responsibilities
              </Typography>
              <Typography fontSize={14} color="#cbd5e0" sx={{ whiteSpace: "pre-line" }}>
                {selectedJob.responsibilities}
              </Typography>
            </Box>
          )}

          {/* Benefits */}
          {selectedJob.benefits && (
            <Box mb={3}>
              <Typography fontWeight={700} mb={1}>
                Benefits
              </Typography>
              <Typography fontSize={14} color="#cbd5e0" sx={{ whiteSpace: "pre-line" }}>
                {selectedJob.benefits}
              </Typography>
            </Box>
          )}

          {/* Apply Button */}
          {!selectedJob.job_status || selectedJob.job_status === "Not Applied" && (
            <Button
              onClick={() => setApplyOpen(true)}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                color: "#000",
                fontWeight: 700,
                py: 1.5,
              }}
            >
              Apply Now
            </Button>
          )}
        </Box>
      )}
    </Drawer>
  );

  const userInfo = useSelector((state) => state.userInfo.userInfo);

  return (
    <>
      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={selectedJob}
      />
      <JobMatchModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        job={selectedJob}
      />

      <Box sx={{ minHeight: "100vh", py: { xs: 2, md: 3 }, px: { xs: 1, md: 2 } }}>
        {/* Header */}
        <Box mb={3} className="flex items-center justify-between">
          <div>
            <Typography variant="h4" fontWeight={700} color="#fff" mb={1}>
              {t("Discover Jobs")}
            </Typography>
            <Typography color="#a0aec0">
              {totalJobs} positions available
            </Typography>
          </div>
          {
            userInfo?.is_company && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push("/jp/jobs/creator")}
              > Create Job</Button>
            )
          }
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Desktop Filters */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: "20px", // Adjust this value if needed (to create space from the top of the viewport)
              height: "calc(100vh - 20px)", // Make the sidebar fill the screen height minus top margin
              overflowY: "auto", // Enable scrolling if sidebar content overflows
            }}
          >
            <FilterSidebar />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box display="flex" gap={1} mb={3}>
              <TextField
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "#6754e8" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid rgba(103, 84, 232, 0.3)",
                    color: "#fff",
                    "&:hover": { borderColor: "rgba(103, 84, 232, 0.5)" },
                  },
                }}
              />
              <IconButton
                onClick={() => setMobileFilterOpen(true)}
                sx={{
                  display: { xs: "flex", md: "none" },
                  background: "linear-gradient(135deg, #6754e8 0%, #764ba2 100%)",
                  color: "#fff",
                  position: "relative",
                }}
              >
                <Badge badgeContent={activeFilterCount} color="error">
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* Mobile Filter Drawer */}
            <Drawer
              anchor="left"
              open={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              className="no-scrollbar"
              PaperProps={{
                sx: {
                  width: "80vw",
                  maxWidth: 300,
                  background: "#0d0d0d",
                },
              }}
            >
              <Box p={2}>
                <IconButton
                  onClick={() => setMobileFilterOpen(false)}
                  sx={{ mb: 2 }}
                >
                  <CloseIcon sx={{ color: "#fff" }} />
                </IconButton>
                <FilterSidebar mobile />
              </Box>
            </Drawer>

            {/* Jobs List */}
            <Box
            className="no-scrollbar"
              sx={{
                maxHeight: "calc(100vh - 160px)", // Adjust based on the height of the header and search bar
                overflowY: "auto", // Enable vertical scrolling for the main content
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" py={5}>
                  <CircularProgress sx={{ color: "#6754e8" }} />
                </Box>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => openJobDrawer(job)}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    borderRadius: 3,
                    border: "1px dashed rgba(103, 84, 232, 0.3)",
                  }}
                >
                  <Typography color="#a0aec0" mb={1}>
                    No jobs found
                  </Typography>
                  <Button
                    size="small"
                    onClick={clearFilters}
                    sx={{ color: "#6754e8" }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

      </Box>

      {/* Job Drawer */}
      <JobDrawer />
    </>
  );
}