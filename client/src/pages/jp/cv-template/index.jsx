"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function CvPage() {
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const profile = userInfo?.profile;

  return (
    <>
      {/* ===== PRINT CSS (GLOBAL) ===== */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden !important;
          }

          #cv-print-area,
          #cv-print-area * {
            visibility: visible !important;
          }

          #cv-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .print-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* PAGE */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* PRINT BUTTON */}
        <Stack direction="row" justifyContent="flex-end" className="print-btn">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => window.print()}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            Print CV (A4)
          </Button>
        </Stack>

        {/* CV SHEET */}
        <Paper
          id="cv-print-area"
          elevation={1}
          sx={{
            p: 5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            width: "210mm",
            minHeight: "297mm",
            mx: "auto",
          }}
        >
          {/* ======================= */}
          {/* HEADER SECTION */}
          {/* ======================= */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">
              {userInfo?.full_name || "Full Name"}
            </Typography>

            <Typography variant="body1" color="text.secondary" mt={1}>
              {userInfo?.email} • {userInfo?.phone_number} •{" "}
              {profile?.location || "Location not set"}
            </Typography>

            {profile?.bio && (
              <Typography variant="body2" mt={2} fontStyle="italic">
                {profile.bio}
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ======================= */}
          {/* SUMMARY */}
          {/* ======================= */}
          {profile?.ai_summary && (
            <>
              <SectionTitle title="PROFESSIONAL SUMMARY" />
              <Typography variant="body2" mb={3} sx={{ whiteSpace: "pre-line" }}>
                {profile.ai_summary}
              </Typography>
            </>
          )}

          {/* ======================= */}
          {/* EDUCATION */}
          {/* ======================= */}
          <SectionTitle title="EDUCATION" />

          {profile?.education_items?.length > 0 ? (
            profile.education_items.map((edu) => (
              <Box mb={2} key={edu.id}>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography variant="body1" fontWeight="600">
                      {edu.institution}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2">
                      {edu.year_start} - {edu.year_end}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2">
                  {edu.degree?.name || "Degree"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No education added</Typography>
          )}

          {/* ======================= */}
          {/* EXPERIENCE */}
          {/* ======================= */}
          <SectionTitle title="EXPERIENCE" />

          {profile?.experiences?.length > 0 ? (
            profile.experiences.map((exp) => (
              <Box mb={2} key={exp.id}>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography variant="body1" fontWeight="600">
                      {exp.company}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2">
                      {exp.start_date} - {exp.end_date}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" fontWeight="500">
                  {exp.job_title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.description}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No experience added</Typography>
          )}

          {/* ======================= */}
          {/* PROJECTS */}
          {/* ======================= */}
          <SectionTitle title="PROJECTS" />

          {profile?.projects?.length > 0 ? (
            profile.projects.map((p) => (
              <Box mb={2} key={p.id}>
                <Typography variant="body1" fontWeight="600">
                  {p.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {p.description}
                </Typography>

                <Typography variant="body2">
                  <strong>Technologies:</strong> {p.technologies}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No projects added</Typography>
          )}

          {/* ======================= */}
          {/* CERTIFICATIONS */}
          {/* ======================= */}
          <SectionTitle title="CERTIFICATIONS" />

          {profile?.certifications?.length > 0 ? (
            profile.certifications.map((c) => (
              <Box mb={2} key={c.id}>
                <Typography variant="body1" fontWeight="600">
                  {c.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {c.issuer} — {c.date_issued}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No certifications added</Typography>
          )}

          {/* ======================= */}
          {/* SKILLS */}
          {/* ======================= */}
          <SectionTitle title="SKILLS" />

          {profile?.skills?.length > 0 ? (
            profile.skills.map((sk) => (
              <Typography variant="body2" mb={1} key={sk.id}>
                <strong>{sk.skill?.name}</strong> — {sk.level} (
                {sk.proficiency_percentage}%)
              </Typography>
            ))
          ) : (
            <Typography>No skills added</Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}

/* -------------------------------------------------- */
/* COMPONENTS */
/* -------------------------------------------------- */

function SectionTitle({ title }) {
  return (
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{ borderBottom: "2px solid #e0e0e0", pb: 0.5, mb: 2 }}
    >
      {title}
    </Typography>
  );
}
