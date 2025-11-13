"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import toast from "react-hot-toast";
import apiRequest from "@/utils/api";

export default function CompanyPanel({ companies = [], token, callUserInfo }) {
  
  const emptyForm = {
    company_name: "",
    industry: "",
    website: "",
    location: "",
    about: "",
    logo: null,
  };

  const [mode, setMode] = useState("list"); 
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");

  // -------------------------
  // VALIDATION LOGIC
  // -------------------------
  const validateForm = () => {
    let temp = {};

    if (!form.company_name.trim()) temp.company_name = "Company name is required";
    if (!form.industry.trim()) temp.industry = "Industry is required";
    if (!form.location.trim()) temp.location = "Location is required";

    if (form.website && !/^https?:\/\/[^ "]+$/.test(form.website)) {
      temp.website = "Enter a valid URL";
    }

    if (!form.about.trim()) temp.about = "About is required";

    setErrors(temp);
    return Object.keys(temp).length === 0; // return true if no errors
  };

  // -------------------------
  // SWITCH TO ADD
  // -------------------------
  const startAdd = () => {
    setMode("create");
    setForm(emptyForm);
    setPreview("");
    setEditingId(null);
    setErrors({});
  };

  // -------------------------
  // SWITCH TO EDIT
  // -------------------------
  const startEdit = (company) => {
    setMode("edit");
    setEditingId(company.id);

    setForm({
      company_name: company.company_name,
      industry: company.industry,
      website: company.website,
      location: company.location,
      about: company.about,
      logo: null,
    });

    setPreview(company.logo || "");
    setErrors({});
  };

  const cancelEdit = () => {
    setMode("list");
    setErrors({});
  };

  // -------------------------
  // UPLOAD LOGO
  // -------------------------
  const pickLogo = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)) {
      toast.error("Invalid image type. Only PNG/JPG/WEBP allowed.");
      return;
    }

    setForm({ ...form, logo: f });
    setPreview(URL.createObjectURL(f));
  };

  // -------------------------
  // SUBMIT FORM
  // -------------------------
  const saveCompany = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    let url = "/auth/company-profile/";
    let method = "POST";

    if (editingId) {
      url += `${editingId}/`;
      method = "PUT";
    }

    try {
      const res = await apiRequest(url, method, token, formData, true);
      if (res?.success) {
        toast.success(editingId ? "Company updated" : "Company added");
        cancelEdit();
        callUserInfo();
      }
    } catch (err) {
      setErrors(err);
      toast.error("Error saving company");
    }
  };

  // -------------------------
  // DELETE
  // -------------------------
  const deleteCompany = async (id) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      await apiRequest(`/auth/company-profile/${id}/`, "DELETE", token);
      toast.success("Company deleted");
      callUserInfo();
    } catch {
      toast.error("Error deleting company");
    }
  };


  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Company Profiles
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* LIST MODE */}
      {mode === "list" && (
        <>
          <Button variant="contained" sx={{ mb: 2 }} onClick={startAdd}>
            + Add Company
          </Button>

          {companies.length === 0 && <Typography>No companies added yet.</Typography>}

          {companies.map((company) => (
            <Paper key={company.id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={process.env.NEXT_PUBLIC_URL_DASHBOARD + company.logo}
                  sx={{ width: 60, height: 60 }}
                  variant="rounded"
                />
                <Box>
                  <Typography fontWeight={600}>{company.company_name}</Typography>
                  <Typography variant="body2">{company.industry}</Typography>
                </Box>

                <Box sx={{ ml: "auto" }}>
                  <Button size="small" variant="outlined" onClick={() => startEdit(company)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => deleteCompany(company.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </>
      )}

      {/* FORM MODE */}
      {mode !== "list" && (
        <>
          <Typography variant="h6" mb={2}>
            {mode === "create" ? "Add Company" : "Edit Company"}
          </Typography>

          <Avatar
            src={mode === "edit" ? process.env.NEXT_PUBLIC_URL_DASHBOARD + preview : preview}
            sx={{ width: 90, height: 90, mb: 2 }}
          />

          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Upload Logo
            <input hidden type="file" accept="image/*" onChange={pickLogo} />
          </Button>

          <TextField
            fullWidth
            label="Company Name"
            sx={{ mb: 2 }}
            name="company_name"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            error={!!errors.company_name}
            helperText={errors.company_name}
          />

          <TextField
            fullWidth
            label="Industry"
            sx={{ mb: 2 }}
            name="industry"
            value={form.industry}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            error={!!errors.industry}
            helperText={errors.industry}
          />

          <TextField
            fullWidth
            label="Website"
            sx={{ mb: 2 }}
            name="website"
            value={form.website}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            error={!!errors.website}
            helperText={errors.website}
          />

          <TextField
            fullWidth
            label="Location"
            sx={{ mb: 2 }}
            name="location"
            value={form.location}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            error={!!errors.location}
            helperText={errors.location}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="About"
            sx={{ mb: 3 }}
            name="about"
            value={form.about}
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            error={!!errors.about}
            helperText={errors.about}
          />

          <Button variant="contained" onClick={saveCompany} sx={{ mr: 2 }}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>

          <Button variant="outlined" color="secondary" onClick={cancelEdit}>
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
}
