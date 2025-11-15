import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const popularTags = [
  { label: "React Developer", value: "React Developer" },
  { label: "Remote Jobs", value: "Remote" },
  { label: "Frontend Developer", value: "Frontend" },
  { label: "Data Analyst", value: "Data Analyst" },
  { label: "Internships", value: "Internship" },
];

export default function PopularTags() {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = (value) => {
    router.push({
      pathname: "/jobs",
      query: { keyword: value },
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Popular Searches
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
        {popularTags.map((tag) => (
          <Button
            key={tag.label}
            onClick={() => handleClick(tag.value)}
            variant="outlined"
            fullWidth
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 2,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : theme.palette.divider,
              color: theme.palette.text.primary,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
              transition: 'all 0.3s',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : theme.palette.grey[200],
                color: theme.palette.primary.main,
                flexShrink: 0,
                transition: 'all 0.3s',
                '.MuiButton-root:hover &': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                },
              }}
            >
              <FaSearch size={12} />
            </Box>

            <Typography variant="body2" fontWeight={500}>
              {tag.label}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
