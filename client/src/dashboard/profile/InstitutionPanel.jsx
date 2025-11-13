"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
  Paper
} from "@mui/material";

import toast from "react-hot-toast";
import apiRequest from "@/utils/api";

export default function InstitutionPanel({ institutions = [], token, callUserInfo }) {

  const emptyForm = {
    institution_name: "",
    institution_type: "",
    website: "",
    location: "",
    about: "",
    logo: null,
  };

  const [mode, setMode] = useState("list"); 
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  // ------------------------------------
  // VALIDATION LOGIC
  // ------------------------------------
  const validateForm = () => {
    let temp = {};

    if (!form.institution_name.trim())
      temp.institution_name = "Institution name is required";

    if (!form.institution_type.trim())
      temp.institution_type = "Institution type is required";

    if (form.website && !/^https?:\/\/[^ "]+$/.test(form.website))
      temp.website = "Enter a valid URL";

    if (!form.location.trim())
      temp.location = "Location is required";

    if (!form.about.trim())
      temp.about = "About is required";

    setErrors(temp);
    return Object.keys(temp).length === 0; 
  };

  // ------------------------------------
  const startAdd = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setPreview("");
    setErrors({});
  };

  // ------------------------------------
  const startEdit = (institution) => {
    setMode("edit");
    setEditingId(institution.id);

    setForm({
      institution_name: institution.institution_name,
      institution_type: institution.institution_type,
      website: institution.website,
      location: institution.location,
      about: institution.about,
      logo: null,
    });

    setPreview(institution.logo || "");
    setErrors({});
  };

  // ------------------------------------
  const cancelEdit = () => {
    setMode("list");
    setForm(emptyForm);
    setPreview("");
    setEditingId(null);
    setErrors({});
  };

  // ------------------------------------
  const pickLogo = (e) => {
    const f = e.target.files[0];

    if (!f) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)) {
      toast.error("Invalid image type. Only PNG, JPG, WEBP allowed.");
      return;
    }

    setForm({ ...form, logo: f });
    setPreview(URL.createObjectURL(f));
  };

  // ------------------------------------
  const saveInstitution = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val);
    });

    let url = "/auth/institution-profile/";
    let method = "POST";

    if (editingId) {
      url += `${editingId}/`;
      method = "PUT";
    }

    try {
      const res = await apiRequest(url, method, token, formData, true);
      if (res?.success) {
        toast.success(editingId ? "Institution updated" : "Institution created");
        cancelEdit();
        callUserInfo();
      }
    } catch (err) {
        setErrors(err);
      toast.error("Error saving institution");
    }
  };

  // ------------------------------------
  const deleteInstitution = async (id) => {
    if (!confirm("Delete this institution?")) return;

    try {
      await apiRequest(`/auth/institution-profile/${id}/`, "DELETE", token);
      toast.success("Institution deleted");
      callUserInfo();
    } catch {
      toast.error("Error deleting institution");
    }
  };

  // ------------------------------------
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Institution Profiles
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* ========================== LIST MODE ========================== */}
      {mode === "list" && (
        <>
          <Button variant="contained" sx={{ mb: 2 }} onClick={startAdd}>
            + Add Institution
          </Button>

          {institutions.length === 0 && (
            <Typography>No institutions added yet.</Typography>
          )}

          {institutions.map((inst) => (
            <Paper key={inst.id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={process.env.NEXT_PUBLIC_URL_DASHBOARD + inst.logo}
                  sx={{ width: 60, height: 60 }}
                  variant="rounded"
                />

                <Box>
                  <Typography fontWeight={600}>
                    {inst.institution_name}
                  </Typography>
                  <Typography variant="body2">{inst.institution_type}</Typography>
                </Box>

                <Box sx={{ ml: "auto" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => startEdit(inst)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => deleteInstitution(inst.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </>
      )}

      {/* ========================== FORM MODE ========================== */}
      {mode !== "list" && (
        <>
          <Typography variant="h6" mb={2}>
            {mode === "create" ? "Add Institution" : "Edit Institution"}
          </Typography>

          <Avatar
            src={mode === "create" ? preview : process.env.NEXT_PUBLIC_URL_DASHBOARD + preview}
            sx={{ width: 100, height: 100, mb: 2 }}
          />

          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Upload Logo
            <input hidden type="file" accept="image/*" onChange={pickLogo} />
          </Button>

          <TextField
            fullWidth
            label="Institution Name"
            sx={{ mb: 2 }}
            value={form.institution_name}
            onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
            error={!!errors.institution_name}
            helperText={errors.institution_name}
          />

          <TextField
            fullWidth
            label="Type (University, School, Academy)"
            sx={{ mb: 2 }}
            value={form.institution_type}
            onChange={(e) => setForm({ ...form, institution_type: e.target.value })}
            error={!!errors.institution_type}
            helperText={errors.institution_type}
          />

          <TextField
            fullWidth
            label="Website"
            sx={{ mb: 2 }}
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            error={!!errors.website}
            helperText={errors.website}
          />

          <TextField
            fullWidth
            label="Location"
            sx={{ mb: 2 }}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            error={!!errors.location}
            helperText={errors.location}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="About"
            sx={{ mb: 3 }}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            error={!!errors.about}
            helperText={errors.about}
          />

          <Button variant="contained" sx={{ mr: 2 }} onClick={saveInstitution}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>

          <Button variant="outlined" onClick={cancelEdit}>
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
}
