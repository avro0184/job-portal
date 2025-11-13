import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
} from "@mui/material";

export default function MainFeed() {
  return (
    <Box>
      {/* Post input box */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Avatar />

          <TextField
            fullWidth
            placeholder="Write a post..."
            multiline
            minRows={2}
            sx={{
              background: "#f9f9f9",
              borderRadius: 2,
            }}
          />
        </Box>

        <Button
          sx={{
            mt: 2,
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            alignSelf: "flex-end",
          }}
          variant="contained"
        >
          Post
        </Button>
      </Card>

      {/* Example Post */}
      <Card
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Avatar />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Nafis Pial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2h ago
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ mt: 1, mb: 2 }}>
          Did everything right… still got replaced.
        </Typography>

        <Divider />

        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            👍 Like
          </Typography>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            💬 Comment
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
