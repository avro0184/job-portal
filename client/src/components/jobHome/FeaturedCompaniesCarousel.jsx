import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaBriefcase } from "react-icons/fa";
import Image from "next/image";
import { Typography, Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FeaturedCompaniesCarousel = ({ companies }) => {
  const scrollRef = useRef(null);
  const theme = useTheme();

  const scrollByAmount = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <Box component="section" sx={{ mt: 8 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            🌟 Featured Companies
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Trusted organizations actively hiring talent.
          </Typography>
        </Box>

        {/* Arrows */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
          }}
        >
          <IconButton
            onClick={() => scrollByAmount(-260)}
            sx={{
              backdropFilter: "blur(10px)",
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `1px solid ${theme.palette.divider}`,
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <FaChevronLeft size={14} />
          </IconButton>

          <IconButton
            onClick={() => scrollByAmount(260)}
            sx={{
              backdropFilter: "blur(10px)",
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `1px solid ${theme.palette.divider}`,
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <FaChevronRight size={14} />
          </IconButton>
        </Box>
      </Box>

      {/* Scroll Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          scrollBehavior: "smooth",
          px: 1,
          pb: 1,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(148,163,184,0.25)"
                : theme.palette.divider,
            borderRadius: 3,
          },
        }}
      >
        {companies.map((company) => (
          <Box
            key={company.name}
            sx={{
              minWidth: { xs: "220px", sm: "260px" },
              p: 2.2,
              borderRadius: 4,
              cursor: "pointer",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #0f172a, #1e293b)"
                  : "linear-gradient(145deg, #ffffff, #f1f5f9)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 4px 12px rgba(0,0,0,0.4)"
                  : "0 4px 12px rgba(0,0,0,0.07)",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.35s",
              "&:hover": {
                transform: "translateY(-4px) scale(1.02)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 20px rgba(0,0,0,0.55)"
                    : "0 8px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            {/* Company Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.7,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  overflow: "hidden",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "#1e293b"
                      : theme.palette.grey[200],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={48}
                    height={48}
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <FaBriefcase size={18} color={theme.palette.primary.main} />
                )}
              </Box>

              <Box>
                <Typography variant="body1" fontWeight={700}>
                  {company.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {company.tagline}
                </Typography>
              </Box>
            </Box>

            {/* Job Count */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {company.jobs}
              </Typography>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: theme.palette.primary.main }}
              >
                Explore →
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedCompaniesCarousel;
