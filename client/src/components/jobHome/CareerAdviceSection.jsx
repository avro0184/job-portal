import {
  FaFileAlt,
  FaComments,
  FaChartLine,
  FaHandshake,
} from "react-icons/fa";
import { Typography, Box, Button, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const guides = [
  {
    title: "How to Write a Killer CV",
    description:
      "Structure your resume, highlight your achievements, and pass ATS filters with ease.",
    icon: FaFileAlt,
    tag: "CV & Resume",
  },
  {
    title: "Common Interview Questions",
    description:
      "Prepare for HR and technical interviews with real-world sample questions and answers.",
    icon: FaComments,
    tag: "Interviews",
  },
  {
    title: "Top In-Demand Skills in 2025",
    description:
      "See which technical and soft skills are trending across industries this year.",
    icon: FaChartLine,
    tag: "Skills & Growth",
  },
  {
    title: "Salary Negotiation Guides",
    description:
      "Learn how to research salary ranges and negotiate offers with confidence.",
    icon: FaHandshake,
    tag: "Salary & Offers",
  },
];

export default function CareerAdviceSection() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        mt: 6,
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? '#111827' : theme.palette.grey[100],
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, lg: 0 }, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" color="textPrimary" fontWeight={600}>
              Career Advice & Guides
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Learn how to level up your job search and grow your career faster.
            </Typography>
          </Box>

          {/* optional small label */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: '0.65rem' }}
          >
            Updated regularly for job seekers like you
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}>
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <Button
                key={guide.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' ? '#020617' : theme.palette.background.paper,
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : theme.palette.divider}`,
                  px: 2,
                  py: 2,
                  textAlign: 'left',
                  textTransform: 'none',
                  boxShadow: 1,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : theme.palette.action.hover,
                    boxShadow: 3,
                  },
                  transition: 'all 0.3s',
                }}
              >
                {/* Icon + tag */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : theme.palette.grey[200],
                      color: theme.palette.primary.main,
                      transition: 'all 0.3s',
                      '.MuiButton-root:hover &': {
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      },
                    }}
                  >
                    <Icon size={16} />
                  </Box>

                  <Chip
                    label={guide.tag}
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      height: 'auto',
                      py: 0.5,
                      backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : theme.palette.divider}`,
                    }}
                  />
                </Box>

                {/* Title */}
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="textPrimary"
                  sx={{
                    transition: 'color 0.3s',
                    '.MuiButton-root:hover &': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {guide.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    mt: 1,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {guide.description}
                </Typography>

                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    mt: 1.5,
                    fontSize: '0.65rem',
                    transition: 'color 0.3s',
                    '.MuiButton-root:hover &': {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  Read guide →
                </Typography>
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
