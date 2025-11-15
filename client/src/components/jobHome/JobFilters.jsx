import { useState } from "react";
import { FaFilter, FaHome, FaClock, FaSuitcase } from "react-icons/fa";
import { Typography, Box, Button, TextField, MenuItem, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useTranslate from "@/hooks/useTranslation";

const jobTypes = [
  { key: "full-time", label: "Full-Time", icon: FaSuitcase },
  { key: "part-time", label: "Part-Time", icon: FaClock },
  { key: "remote", label: "Remote", icon: FaHome },
];

export default function JobFilters({ onApply }) {
  const theme = useTheme();
  const {t} = useTranslate();
  const [selectedJobType, setSelectedJobType] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const handleApply = () => {
    onApply?.({
      jobType: selectedJobType,
      level,
      location,
      salary,
    });
  };

  const handleClear = () => {
    setSelectedJobType("");
    setLevel("");
    setLocation("");
    setSalary("");
    onApply?.({
      jobType: "",
      level: "",
      location: "",
      salary: "",
    });
  };

  return (
    <Box
      sx={{
        mt: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.mode === 'dark' ? '#020617' : theme.palette.background.paper,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : theme.palette.divider}`,
        p: 2,
        boxShadow: 1,
      }}
    >
    
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
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
          }}
        >
          <FaFilter size={12} />
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600} color="textPrimary">
            {t("Filter Jobs")}
          </Typography>
          <Typography variant="caption" color="textSecondary" fontSize="0.65rem">
            {t("Narrow down results quickly")}.
          </Typography>
        </Box>
      </Box>

      {/* Job type pills */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
          {t("Job Type")}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {jobTypes.map(({ key, label, icon: Icon }) => (
            <Chip
              key={key}
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: 1.5,
                    backgroundColor: selectedJobType === key
                      ? 'rgba(255, 255, 255, 0.2)'
                      : theme.palette.mode === 'dark' ? '#1e293b' : theme.palette.grey[200],
                    color: selectedJobType === key ? '#fff' : theme.palette.primary.main,
                  }}
                >
                  <Icon size={9} />
                </Box>
              }
              label={label}
              onClick={() => setSelectedJobType((prev) => (prev === key ? "" : key))}
              variant={selectedJobType === key ? "filled" : "outlined"}
              color={selectedJobType === key ? "primary" : "default"}
              size="small"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.3)' : theme.palette.divider,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Experience level */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
          {t("Experience Level")}
        </Typography>
        <TextField
          select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">{("Any level")}</MenuItem>
          <MenuItem value="junior">{("Junior")}</MenuItem>
          <MenuItem value="mid">{("Mid")}</MenuItem>
          <MenuItem value="senior">{("Senior")}</MenuItem>
        </TextField>
      </Box>

      {/* Location */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
          {t("Location")}
        </Typography>
        <TextField
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City / Remote"
          size="small"
          fullWidth
          variant="outlined"
        />
      </Box>

      {/* Salary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
          {t("Salary Range")}
        </Typography>
        <TextField
          select
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="40-60">৳40k – 60k</MenuItem>
          <MenuItem value="60-80">৳60k – 80k</MenuItem>
          <MenuItem value="80+">৳80k+</MenuItem>
        </TextField>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Button
          onClick={handleClear}
          size="small"
          sx={{
            fontSize: '0.65rem',
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: 'transparent',
            },
          }}
        >
          Clear all
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          size="small"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            px: 2,
            borderRadius: 2,
          }}
        >
          {t("Apply Filters")}
        </Button>
      </Box>
    </Box>
  );
}
