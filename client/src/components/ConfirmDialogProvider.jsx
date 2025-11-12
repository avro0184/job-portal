"use client";
import React, { useState, useCallback, createContext, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  TextField,
  Typography,
  IconButton,
  Stack
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmContext = createContext(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside provider");
  return ctx.confirm;
}

export default function ConfirmDialogProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: "",
    content: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmColor: "error",
    verifyText: null,
    userTyped: "",
    onResolve: () => {}
  });

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      setState({
        ...opts,
        open: true,
        userTyped: "",
        onResolve: resolve,
      });
    });
  }, []);

  const close = (result) => {
    setState((s) => ({ ...s, open: false }));
    setTimeout(() => state.onResolve(result), 0);
  };

  const disableConfirm =
    state.verifyText && state.userTyped.trim() !== state.verifyText;

  const handleCopyText = () => {
    navigator.clipboard.writeText(state.verifyText || "");
    toast.success("Copied ✅");
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={state.open} onClose={() => close(false)} TransitionComponent={Transition}>
        <DialogTitle>{state.title}</DialogTitle>

        <DialogContent dividers>

          {/* Main instruction text */}
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {state.content}
          </Typography>

          {/* ✅ Verification Text - Only Once */}
          {state.verifyText && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
              <Typography
                fontWeight="bold"
                sx={{ color: "red" }}
              >
                {state.verifyText}
              </Typography>

              {/* Copy Button */}
              <IconButton onClick={handleCopyText} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Stack>
          )}

          {/* ✅ Input field */}
          {state.verifyText && (
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Type exact text above"
              value={state.userTyped}
              onChange={(e) =>
                setState((prev) => ({ ...prev, userTyped: e.target.value }))
              }
              autoFocus
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button color="error" variant="outlined" onClick={() => close(false)}>
            {state.cancelText}
          </Button>
          <Button
            variant="contained"
            disabled={disableConfirm}
            color={state.confirmColor}
            onClick={() => close(true)}
          >
            {state.confirmText}
          </Button>
        </DialogActions>

      </Dialog>
    </ConfirmContext.Provider>
  );
}
