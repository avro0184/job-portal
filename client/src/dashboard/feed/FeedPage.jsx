import { Box } from "@mui/material";
import LeftSidebar from "./LeftSidebar";
import MainFeed from "./MainFeed";
import RightSidebar from "./RightSidebar";

export default function FeedPage() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        p: { xs: 1, md: 3 },
        flexDirection: { xs: "column", md: "row" },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      {/* LEFT SIDEBAR */}
      <Box sx={{ width: { xs: "100%", md: "25%" }, position: "sticky", top: 80 }}>
        <LeftSidebar />
      </Box>

      {/* MAIN FEED */}
      <Box sx={{ width: { xs: "100%", md: "50%" } }}>
        <MainFeed />
      </Box>

      {/* RIGHT SIDEBAR */}
      <Box sx={{ width: { xs: "100%", md: "25%" }, position: "sticky", top: 80 }}>
        <RightSidebar />
      </Box>
    </Box>
  );
}
