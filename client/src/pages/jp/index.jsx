import { Box, Container, Typography, Grid, Paper, Button, Stack, Chip, LinearProgress } from "@mui/material";
import ProfileSection from "@/components/Dashboard/ProfileSection";
import ApplicationActivity from "@/components/Dashboard/ApplicationActivity";
import JobMatches from "@/components/Dashboard/JobMatches";
import CareerRoadmap from "@/components/Dashboard/CareerRoadmap";
import SkillGapAnalysis from "@/components/Dashboard/SkillGapAnalysis";
import CareerBot from "@/components/Dashboard/CareerBot";
import Opportunities from "@/components/Dashboard/Opportunities";
import { useSelector } from "react-redux";
import { getToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/api";
import { t } from "i18next";

// Mock Data
const profileCompletion = 70;
const applications = [
  { company: "Tech Innovators", position: "Frontend Developer", status: "Interview Call" },
  { company: "Creative Solutions", position: "UI/UX Designer", status: "Pending" },
  { company: "Data Systems Inc.", position: "Data Analyst", status: "Rejected" }
];

const jobMatches = [
  { title: "Frontend Developer", company: "Tech Solutions", matchPercentage: 85 },
  { title: "Junior MERN Developer", company: "Digital Labs", matchPercentage: 70 }
];

const roadmapPhases = [
  { phase: "Phase 1: Foundation Skills", status: "completed" },
  { phase: "Phase 2: Advanced React", status: "in-progress" },
  { phase: "Phase 3: Full-Stack Concepts", status: "upcoming" }
];

const skills = [
  { name: "React", category: "strong" },
  { name: "JavaScript", category: "strong" },
  { name: "HTML", category: "strong" },
  { name: "CSS", category: "strong" },
  { name: "Git", category: "strong" },
  { name: "Communication", category: "improve" },
  { name: "Tailwind", category: "improve" },
  { name: "Figma", category: "improve" }
];

const opportunities = [
  { type: "BDJobs", title: "Junior Web Developer at Tech Innovators" },
  { type: "Govt ICT", title: "Free Training on Advanced Graphics Design" },
  { type: "NGO Program", title: "Youth Internship for Sustainable Development" }
];


export default function Dashboard() {
  const token = getToken()
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  useEffect(() => {
    if (!token) return;

    const recomened_job = async () => {
      const response = await apiRequest("jobs/recommended/", "GET", token);
      if (response?.success) {
        setRecommendedJobs(response?.recommended)
      }
    };

    const CarerRoadMap = async () => {
      const response = await apiRequest("career-roadmap/", "GET", token);
      if (response?.success) {
        setRoadmap(response?.roadmaps)
      }
    };

    CarerRoadMap()
    recomened_job(); 
  }, [token]);

  console.log(roadmap)

  const userInfo = useSelector((state) => state.userInfo.userInfo);
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ flex: 1 }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
            {t("AI Career Dashboard")}
          </Typography>

          {/* Profile Section */}
          <ProfileSection userInfo={userInfo} />

          {/* Application Activity */}
          <ApplicationActivity token={token} />

          {/* Job Matches and Career Roadmap - Two Columns */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Recommended Jobs
                </Typography>

                <Stack spacing={3} sx={{ mt: 2 }}>
                  {recommendedJobs.map((job, i) => (
                    <JobMatches job={job} key={i} />
                  ))}
                </Stack>
              </Paper>

            </Grid>

            <Grid item xs={12} sm={6}>
              <CareerRoadmap phases={roadmap} />
            </Grid>
          </Grid>

          {/* Skill Gap Analysis and CareerBot - Two Columns */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <SkillGapAnalysis skills={skills} suggestedCourses={["Redux Crash Course", "TypeScript for Beginners"]} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CareerBot />
            </Grid>
          </Grid>

          {/* Opportunities Near You */}
          <Opportunities opportunities={opportunities} />
        </Container>
      </Box>
    </Box>
  );
}
