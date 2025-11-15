import { FaArrowRight, FaCalendarAlt, FaTag } from "react-icons/fa";
import { Typography, Box, IconButton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const defaultPosts = [
  {
    title: "How to Land Your First Developer Job",
    excerpt: "Practical tips on building a portfolio, writing a strong CV, and preparing for technical interviews.",
    date: "Nov 10, 2025",
    tag: "Career Tips",
  },
  {
    title: "Top 10 Skills Companies Look For in 2025",
    excerpt: "A breakdown of the most in-demand technical and soft skills recruiters are searching for.",
    date: "Nov 05, 2025",
    tag: "Trends",
  },
  {
    title: "Remote Work: How to Stand Out in Global Talent Pools",
    excerpt: "Learn how to position yourself for remote-friendly roles across the world.",
    date: "Oct 28, 2025",
    tag: "Remote Jobs",
  },
];

export default function BlogSection({ posts = defaultPosts }) {
  const theme = useTheme();

  return (
    <Box component="aside" sx={{ width: '100%' }}>
      <Typography variant="h5" color="textPrimary" fontWeight={600}>
        Latest from the Blog
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
        Insights and tips to grow your career.
      </Typography>

      <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post) => (
          <Button
            key={post.title}
            sx={{
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              gap: 1.5,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? '#020617' : theme.palette.background.paper,
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : theme.palette.divider}`,
              px: 2,
              py: 1.5,
              boxShadow: 1,
              textTransform: 'none',
              justifyContent: 'flex-start',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : theme.palette.action.hover,
                boxShadow: 3,
              },
              transition: 'all 0.3s',
            }}
          >
            {/* Icon block */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
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
              <FaArrowRight size={14} />
            </Box>

            {/* Text block */}
            <Box sx={{ flex: 1 }}>
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
                {post.title}
              </Typography>

              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  mt: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.excerpt}
              </Typography>

              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FaCalendarAlt size={10} />
                  <Typography variant="caption" color="textSecondary" fontSize="0.65rem">
                    {post.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FaTag size={10} />
                  <Typography variant="caption" color="textSecondary" fontSize="0.65rem">
                    {post.tag}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Button>
        ))}
      </Box>

      {/* View all button */}
      <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          endIcon={<FaArrowRight size={10} />}
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: theme.palette.primary.main,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: 'transparent',
            },
            transition: 'color 0.3s',
          }}
        >
          View all posts
        </Button>
      </Box>
    </Box>
  );
}
