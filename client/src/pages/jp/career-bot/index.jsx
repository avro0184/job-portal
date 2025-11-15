"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";

export default function CareerBotApp() {
  const token = getToken();

  const [bots, setBots] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentBot, setCurrentBot] = useState(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [newBotDesc, setNewBotDesc] = useState("");

  const [input, setInput] = useState("");
  const [loadingBots, setLoadingBots] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);

  const chatRef = useRef(null);

  // Auto-scroll bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Load Bots
  const loadBots = async () => {
    setLoadingBots(true);
    const res = await apiRequest("/bot/list/", "GET", token);
    if (res?.success) setBots(res.data);
    setLoadingBots(false);
  };

  useEffect(() => {
    loadBots();
  }, []);

  // Create Bot
  const createBot = async () => {
    if (!newBotName.trim()) return;

    await apiRequest("/bot/create/", "POST", token, {
      name: newBotName,
      description: newBotDesc,
    });

    setNewBotName("");
    setNewBotDesc("");
    setOpenCreateModal(false);
    loadBots();
  };

  // Delete Bot
  const deleteBot = async (id, e) => {
    e.stopPropagation();

    await apiRequest(`/bot/${id}/delete/`, "DELETE", token);

    if (currentBot?.id === id) {
      setCurrentBot(null);
      setMessages([]);
    }

    loadBots();
  };

  // Load Messages for selected bot
  const loadMessages = async (bot) => {
    setCurrentBot(bot);

    const res = await apiRequest(`/messages/${bot.id}/`, "GET", token);
    if (res?.success) setMessages(res.messages);
  };

  // Delete message
  const deleteMessage = async (id) => {
    await apiRequest(`/message/${id}/delete/`, "DELETE", token);
    if (currentBot) loadMessages(currentBot);
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !currentBot) return;

    const userText = input;

    // 1️⃣ Show user message instantly
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setTyping(true);

    try {
      // 2️⃣ Backend call
      const res = await apiRequest(`/chat/${currentBot.id}/`, "POST", token, {
        query: userText,
      });

      // 3️⃣ Add bot message
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: res?.answer || "No response",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "bot",
          text: "⚠️ Something went wrong.",
        },
      ]);
    }

    setTyping(false);
  };

  // Typing animation dots
  const TypingDots = () => (
    <Box sx={{ display: "flex", gap: 1, pl: 1 }}>
      <span className="dot one"></span>
      <span className="dot two"></span>
      <span className="dot three"></span>

      <style>{`
        .dot {
          width: 8px;
          height: 8px;
          background: #757575;
          border-radius: 50%;
          display: inline-block;
          animation: jump 1s infinite;
        }
        .one { animation-delay: 0s; }
        .two { animation-delay: 0.2s; }
        .three { animation-delay: 0.4s; }

        @keyframes jump {
          0% { transform: translateY(0); opacity: .4; }
          50% { transform: translateY(-5px); opacity: 1; }
          100% { transform: translateY(0); opacity: .4; }
        }
      `}</style>
    </Box>
  );

  // ----------------------------------------------------
  // UI Rendering
  // ----------------------------------------------------
  return (
    <Box sx={{ p: 3, display: "flex", gap: 3 }}>

    <Grid container spacing={3}>
  {/* LEFT PANEL — BOT LIST (4 Columns) */}
  <Grid item xs={12} md={4}>
    <Paper sx={{ p: 2, borderRadius: 3 }} elevation={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" fontWeight={700}>
          Your Bots
        </Typography>

        <IconButton onClick={() => setOpenCreateModal(true)} color="primary">
          <AddIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {loadingBots ? (
        <CircularProgress size={30} />
      ) : (
        bots.map((bot) => (
          <Paper
            key={bot.id}
            sx={{
              p: 1.3,
              mb: 1,
              borderRadius: 2,
              cursor: "pointer",
              border:
                currentBot?.id === bot.id
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
              background:
                currentBot?.id === bot.id ? "primary" : "transparent",
            }}
            onClick={() => loadMessages(bot)}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>{bot.name}</Typography>

              <IconButton
                size="small"
                onClick={(e) => deleteBot(bot.id, e)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))
      )}
    </Paper>
  </Grid>

  {/* RIGHT PANEL — CHAT WINDOW (8 Columns) */}
  <Grid item xs={12} md={8}>
    <Paper className="no-scrollbar" sx={{ p: 2, borderRadius: 3, height: "100%" }} elevation={3}>
      {!currentBot ? (
        <Box
          sx={{
            height: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <Typography variant="h6">
            👉 Select a bot to start chatting
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h6" fontWeight={700}>
            {currentBot.name}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Chat Messages */}
          <Box className="no-scrollbar"
            ref={chatRef}
            sx={{
              height: 500,
              overflowY: "auto",
              borderRadius: 3,
              p: 2,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 1.5,
                }}
              >
                <Paper
                  sx={{
                    display: "inline-block",
                    p: 1.2,
                    borderRadius: 2,
                    maxWidth: "70%",
                    bgcolor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    position: "relative",
                  }}
                >
                  {msg.text}

                  {/* <IconButton
                    size="small"
                    sx={{ position: "absolute", top: -10, right: -10 }}
                    onClick={() => deleteMessage(msg.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton> */}
                </Paper>
              </Box>
            ))}

            {typing && (
              <Box sx={{ textAlign: "left", mb: 1 }}>
                <TypingDots />
              </Box>
            )}
          </Box>

          {/* Input */}
          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              fullWidth
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={sendMessage}
              disabled={sending}
            >
              {sending ? "..." : "Send"}
            </Button>
          </Stack>
        </>
      )}
    </Paper>
  </Grid>
</Grid>


      {/* Create Bot Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} fullWidth>
        <DialogTitle>Create New Bot</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Bot Name"
              fullWidth
              value={newBotName}
              onChange={(e) => setNewBotName(e.target.value)}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={newBotDesc}
              onChange={(e) => setNewBotDesc(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={createBot}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
