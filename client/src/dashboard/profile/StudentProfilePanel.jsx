"use client";

import React, { useEffect, useState } from "react";
import {
    Box, TextField, Button, Typography, Divider,
    Autocomplete, FormControlLabel, Checkbox, Grid
} from "@mui/material";

import toast from "react-hot-toast";
import apiRequest from "@/utils/api";

export default function StudentProfilePanel({ profile, token , callUserInfo }) {

    // -------------------------------
    // Base Form
    // -------------------------------
    const [form, setForm] = useState({
        location: profile?.location || "",
        bio: profile?.bio || "",
        career_goal: profile?.career_goal || "",
        portfolio_url: profile?.portfolio_url || "",
        github_url: profile?.github_url || "",
        linkedin_url: profile?.linkedin_url || "",
        availability: profile?.availability || "",
        expected_salary: profile?.expected_salary || "",
        is_job_ready: profile?.is_job_ready || false,
        cv_text: profile?.cv_text || "",
        resume_file: null,
    });

    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    // -------------------------------
    // EDUCATION
    // -------------------------------
    const [degrees, setDegrees] = useState([]);
    const [educationItems, setEducationItems] = useState(
        profile?.education_items || []
    );

    const addEducation = () => {
        setEducationItems([
            ...educationItems,
            { degree_id: null, institution: "", year_start: "", year_end: "" },
        ]);
    };

    const updateEducation = (index, field, value) => {
        const updated = [...educationItems];
        updated[index][field] = value;
        setEducationItems(updated);
    };

    const removeEducation = (index) => {
        setEducationItems(educationItems.filter((_, i) => i !== index));
    };

    // -------------------------------
    // SKILLS
    // -------------------------------
    const [skillsList, setSkillsList] = useState([]);
    const skillLevels = ["beginner", "intermediate", "advanced", "expert"];
    const [skills, setSkills] = useState(profile?.skills || []);

    const addSkill = () => {
        setSkills([...skills, { skill_id: null, level: "beginner" }]);
    };

    const updateSkill = (index, field, value) => {
        const updated = [...skills];
        updated[index][field] = value;
        setSkills(updated);
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    // -------------------------------
    // LOAD DROPDOWNS
    // -------------------------------
    useEffect(() => {
        loadDropdowns();
    }, []);

    const loadDropdowns = async () => {
        try {
            const d = await apiRequest("/auth/dropdown/degrees/", "GET", token);
            const s = await apiRequest("/dropdown/skills/", "GET", token);

            setDegrees(d || []);
            setSkillsList(s || []);
        } catch (err) {
            toast.error("Failed to load dropdowns");
        }
    };

    // -------------------------------
    // Resume Upload
    // -------------------------------
    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((prev) => ({ ...prev, resume_file: file }));
    };

    // -------------------------------
    // SAVE PROFILE
    // -------------------------------
    const saveProfile = async () => {
        setErrors({});

        const payload = {
            ...form,
            education_items: educationItems.map((item) => ({
                degree_id: item.degree_id,
                institution: item.institution,
                year_start: Number(item.year_start),
                year_end: Number(item.year_end),
            })),
            skills: skills.map((item) => ({
                skill_id: item.skill_id,
                level: item.level,
            })),
        };

        try {
            const res = await apiRequest("/auth/profile/", "PUT", token, payload);

            if (res?.success) {
                toast.success("Profile updated");
                callUserInfo();
            } 
        } catch (err) {
            console.log(err)
            setErrors(err);
            toast.error("Error updating profile");
        }
    };


    useEffect(() => {
        if (!profile) return;

        // Convert nested degree -> degree_id
        const mappedEducation = (profile.education_items || []).map((item) => ({
            id: item.id,
            degree_id: item.degree?.id || null,
            institution: item.institution || "",
            year_start: item.year_start || "",
            year_end: item.year_end || ""
        }));

        // Convert nested skill -> skill_id
        const mappedSkills = (profile.skills || []).map((item) => ({
            id: item.id,
            skill_id: item.skill?.id || null,
            level: item.level || "beginner"
        }));

        setEducationItems(mappedEducation);
        setSkills(mappedSkills);
    }, [profile]);


    // -------------------------------
    // UI
    // -------------------------------
    return (
        <Box >
            <Typography variant="h5" fontWeight={700} mb={1}>
                Profile
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* BASIC INFORMATION */}
            <TextField
                fullWidth
                label="Location"
                name="location"
                value={form.location}
                onChange={onChange}
                sx={{ mb: 2 }}
                error={!!errors.location}
                helperText={errors.location}
            />

            <TextField
                fullWidth
                multiline
                rows={3}
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={onChange}
                sx={{ mb: 2 }}
                error={!!errors.bio}
                helperText={errors.bio}
            />

            <TextField
                fullWidth
                multiline
                rows={2}
                label="Career Goal"
                name="career_goal"
                value={form.career_goal}
                onChange={onChange}
                sx={{ mb: 3 }}
                error={!!errors.career_goal}
                helperText={errors.career_goal}
            />

            {/* SOCIAL LINKS */}
            <TextField
                fullWidth
                label="Portfolio URL"
                name="portfolio_url"
                value={form.portfolio_url}
                onChange={onChange}
                sx={{ mb: 2 }}
                error={!!errors.portfolio_url}
                helperText={errors.portfolio_url?.[0]}
            />

            <TextField
                fullWidth
                label="GitHub URL"
                name="github_url"
                value={form.github_url}
                onChange={onChange}
                sx={{ mb: 2 }}
                error={!!errors.github_url}
                helperText={errors.github_url?.[0]}
            />

            <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedin_url"
                value={form.linkedin_url}
                onChange={onChange}
                sx={{ mb: 3 }}
                error={!!errors.linkedin_url}
                helperText={errors.linkedin_url?.[0]}
            />

            {/* EDUCATION SECTION */}
            <Typography variant="h6" mt={3}>
                Education
            </Typography>

            {educationItems.map((item, index) => (
                <Box
                    key={index}
                    sx={{ mt: 2, mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={degrees}
                                getOptionLabel={(o) => o.name}
                                value={degrees.find((x) => x.id === item.degree_id) || null}
                                onChange={(e, v) =>
                                    updateEducation(index, "degree_id", v?.id || null)
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Degree" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Institution"
                                value={item.institution}
                                onChange={(e) =>
                                    updateEducation(index, "institution", e.target.value)
                                }
                            />
                        </Grid>

                        <Grid item xs={6} md={2}>
                            <TextField
                                fullWidth
                                label="Start Year"
                                value={item.year_start}
                                onChange={(e) =>
                                    updateEducation(index, "year_start", e.target.value)
                                }
                            />
                        </Grid>

                        <Grid item xs={6} md={2}>
                            <TextField
                                fullWidth
                                label="End Year"
                                value={item.year_end}
                                onChange={(e) =>
                                    updateEducation(index, "year_end", e.target.value)
                                }
                            />
                        </Grid>
                    </Grid>

                    <Button color="error" sx={{ mt: 1 }} onClick={() => removeEducation(index)}>
                        Remove
                    </Button>
                </Box>
            ))}

            <Button variant="outlined" onClick={addEducation}>
                + Add Education
            </Button>

            {/* SKILLS SECTION */}
            <Typography variant="h6" mt={4}>
                Skills
            </Typography>

            {skills.map((item, index) => (
                <Box
                    key={index}
                    sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={skillsList}
                                getOptionLabel={(o) => o.name}
                                value={skillsList.find((x) => x.id === item.skill_id) || null}
                                onChange={(e, v) =>
                                    updateSkill(index, "skill_id", v?.id || null)
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Skill" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={skillLevels}
                                value={item.level}
                                onChange={(e, v) => updateSkill(index, "level", v)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Level" />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Button color="error" sx={{ mt: 1 }} onClick={() => removeSkill(index)}>
                        Remove
                    </Button>
                </Box>
            ))}
            <div className="mt-2">
                <Button variant="outlined" onClick={addSkill}>
                    + Add Skill
                </Button>
            </div>


            <div>
                {/* JOB STATUS */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.is_job_ready}
                            onChange={(e) =>
                                setForm({ ...form, is_job_ready: e.target.checked })
                            }
                        />
                    }
                    label="I am job ready"
                    sx={{ mt: 3 }}
                />
            </div>


            {/* CV TEXT */}
            <TextField
                fullWidth
                multiline
                rows={5}
                label="CV Text"
                name="cv_text"
                value={form.cv_text}
                onChange={onChange}
                sx={{ mt: 3 }}
            />
            
            {/* <TextField
                type="file"
                name="resume_file"
                fullWidth
                onChange={handleResumeUpload}
                sx={{ mt: 2 }}
                inputProps={{ accept: ".pdf,.doc,.docx" }}
            /> */}
            {/* SAVE BUTTON */}
            <Button variant="contained" sx={{ mt: 3 }} onClick={saveProfile}>
                Save Profile
            </Button>
        </Box>
    );
}
