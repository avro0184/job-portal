import { FaBuilding } from "react-icons/fa";
import { Typography, Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function CompaniesSection({ companies }) {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" color="textPrimary" fontWeight={600}>
        Top Companies
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
        Explore companies actively hiring.
      </Typography>

      <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {companies.map((company) => (
          <Button
            key={company}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1.25,
              borderRadius: 3,
              backgroundColor: theme.palette.mode === 'dark' ? '#020617' : theme.palette.background.paper,
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : theme.palette.divider}`,
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
            {/* Icon */}
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
                transition: 'all 0.3s',
                '.MuiButton-root:hover &': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                },
              }}
            >
              <FaBuilding size={14} />
            </Box>

            {/* Company name */}
            <Typography variant="body2" fontWeight={500} color="textPrimary">
              {company}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
