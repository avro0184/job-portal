import { Box, Typography, LinearProgress, Button, Stack } from "@mui/material"; // Import Box here
import { useRouter } from "next/router";

export default function ProfileSection({ userInfo }) {
  const router = useRouter();
  return (
    <Box sx={{ p: 3, mb: 3, bgcolor: "background.paper", borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
        Hello, {userInfo?.full_name}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Welcome back to your Career Dashboard
      </Typography>

      {/* Profile Completion Progress */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Profile Completion
        </Typography>
        <LinearProgress
          variant="determinate"
          value={userInfo?.profile?.completion_percentage}
          sx={{
            mt: 1,
            borderRadius: 2,
            height: 8,
            bgcolor: "rgba(255,255,255,0.1)",
            "& .MuiLinearProgress-bar": { backgroundColor: "#6754e8" },
          }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary", mt: 1 }}>
          {userInfo?.profile?.completion_percentage}% completed
        </Typography>
      </Box>
          <div className="flex gap-x-2">
      <Box sx={{ mt: 3 }}>
        <Button onClick={()=> router.push("/jp/profile")} variant="outlined" size="small">
          Edit Profile
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button onClick={()=>router.push("/jp/career-roadmap")} variant="outlined" size="small">
          Genetate Readmap
        </Button>
      </Box>
      </div>
      
    </Box>
  );
}
