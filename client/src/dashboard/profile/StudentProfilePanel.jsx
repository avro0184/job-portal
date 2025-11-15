"use client";

import React, { useEffect, useState } from "react";
import {
    Box, TextField, Button, Typography, Divider,
    Autocomplete, FormControlLabel, Checkbox, Grid,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from "@mui/material";

import toast from "react-hot-toast";
import apiRequest from "@/utils/api";

export default function StudentProfilePanel({ profile, token, callUserInfo }) {

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
            setSkillsList(s?.data || []);

        } catch (err) {
            toast.error("Failed to load dropdowns");
        }
    };

    console.log(skillsList)

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

            education_items: educationItems.map(item => ({
                degree_id: item.degree_id,
                institution: item.institution,
                year_start: Number(item.year_start),
                year_end: Number(item.year_end),
            })),

            skills: skills.map(item => ({
                skill_id: item.skill_id,
                level: item.level,
            })),

            experiences: experiences,

            projects: projects,

            certifications: certifications,
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


    const [cvLoading, setCvLoading] = useState(false);
    const [cvError, setCvError] = useState("");

    const handleCVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCvLoading(true);
        setCvError("");

        const formData = new FormData();
        formData.append("resume_file", file);

        try {
            const res = await apiRequest(
                "/auth/extract-cv/",
                "POST",
                token,
                formData,
                true
            );

            if (!res.success || !res.data) {
                setCvError("Failed to extract CV");
                return;
            }

            toast.success("CV extracted successfully!");

            const extracted = res.data.structured_data;
            const resumeText = res.data.resume_text;

            // 1) Save full CV text
            setForm(prev => ({ ...prev, cv_text: resumeText }));

            // 2) Detect conflicts
            const conflicts = detectConflicts(profile, form, extracted);

            if (Object.keys(conflicts).length > 0) {
                const firstConflict = Object.keys(conflicts)[0];
                setConflictModal({
                    field: firstConflict,
                    current: conflicts[firstConflict].current,
                    cv: conflicts[firstConflict].cv
                });
            }

            // 3) Autofill missing values
            if (!form.bio && extracted.summary) {
                setForm(prev => ({ ...prev, bio: extracted.summary }));
            }

            if (!form.location && extracted.location) {
                setForm(prev => ({ ...prev, location: extracted.location }));
            }

            // 4) Fill Education if empty
            if (educationItems.length === 0 && extracted.education?.length > 0) {
                setEducationItems(
                    extracted.education.map(e => ({
                        degree_id: null,
                        institution: e.institution,
                        year_start: e.start_date,
                        year_end: e.end_date
                    }))
                );
            }

            // 5) Fill Experience if empty
            if (experiences.length === 0 && extracted.experience?.length > 0) {
                setExperiences(
                    extracted.experience.map(ex => ({
                        job_title: ex.title,
                        company: ex.company,
                        location: ex.location || "",
                        start_date: ex.start_date,
                        end_date: ex.end_date,
                        description: ex.description,
                    }))
                );
            }

            // 6) Skill Matching
            if (extracted.skills?.length > 0) {
                const newSkills = [];

                extracted.skills.forEach(cvSkill => {
                    const match = skillsList?.find(
                        s => s.name.toLowerCase() === cvSkill.toLowerCase()
                    );

                    if (match) {
                        newSkills.push({
                            skill_id: match.id,
                            level: "intermediate",
                        });
                    }
                });

                if (newSkills.length > 0) {
                    setSkills(prev => [...prev, ...newSkills]);
                }
            }

        } catch (err) {
            console.log(err);
            setCvError("Error processing CV");
        } finally {
            setCvLoading(false);
        }
    };



    // ---- Conflict Helpers ----
    // ---- Conflict Helpers ----
    const detectConflicts = (currentProfile, form, extracted) => {
        const conflicts = {};

        if (extracted.name && extracted.name !== currentProfile.full_name) {
            conflicts.full_name = {
                current: currentProfile.full_name,
                cv: extracted.name
            };
        }

        if (extracted.email && extracted.email !== currentProfile.email) {
            conflicts.email = {
                current: currentProfile.email,
                cv: extracted.email
            };
        }

        if (extracted.summary && extracted.summary !== form.bio) {
            conflicts.bio = {
                current: form.bio,
                cv: extracted.summary
            };
        }

        return conflicts;
    };


    const [conflictModal, setConflictModal] = useState(null);

    const applyChoice = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setConflictModal(null);
    };



    // -------------------------------
    // EXPERIENCE
    // -------------------------------
    const [experiences, setExperiences] = useState([]);

    const addExperience = () => {
        setExperiences([
            ...experiences,
            {
                job_title: "",
                company: "",
                location: "",
                start_date: "",
                end_date: "",
                description: "",
            }
        ]);
    };

    const updateExperience = (index, field, value) => {
        const temp = [...experiences];
        temp[index][field] = value;
        setExperiences(temp);
    };

    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };


    // -------------------------------
    // PROJECTS
    // -------------------------------
    const [projects, setProjects] = useState([]);

    const addProject = () => {
        setProjects([
            ...projects,
            { title: "", description: "", technologies: "", link: "" }
        ]);
    };

    const updateProject = (index, field, value) => {
        const temp = [...projects];
        temp[index][field] = value;
        setProjects(temp);
    };

    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };


    // -------------------------------
    // CERTIFICATIONS
    // -------------------------------
    const [certifications, setCertifications] = useState([]);

    const addCertification = () => {
        setCertifications([
            ...certifications,
            {
                title: "",
                issuer: "",
                date_issued: "",
                credential_id: "",
                credential_url: "",
            }
        ]);
    };

    const updateCertification = (index, field, value) => {
        const temp = [...certifications];
        temp[index][field] = value;
        setCertifications(temp);
    };

    const removeCertification = (index) => {
        setCertifications(certifications.filter((_, i) => i !== index));
    };


    useEffect(() => {
        if (!profile) return;

        const mappedEducation = (profile.education_items || []).map(item => ({
            id: item.id,
            degree_id: item.degree?.id || null,
            institution: item.institution || "",
            year_start: item.year_start || "",
            year_end: item.year_end || ""
        }));

        const mappedSkills = (profile.skills || []).map(item => ({
            id: item.id,
            skill_id: item.skill?.id || null,
            level: item.level || "beginner",
        }));

        setEducationItems(mappedEducation);
        setSkills(mappedSkills);

        // New 3
        setExperiences(profile.experiences || []);
        setProjects(profile.projects || []);
        setCertifications(profile.certifications || []);

    }, [profile]);

    // -------------------------------
    // UI
    // -------------------------------
    return (
        <>
            <Box >
                <Typography variant="h5" fontWeight={700} mb={1}>
                    Profile
                </Typography>
                <Divider sx={{ mb: 3 }} />


                <TextField
                    type="file"
                    name="resume_file"
                    fullWidth
                    onChange={handleCVUpload}
                    sx={{ mt: 2 }}
                    inputProps={{ accept: ".pdf,.doc,.docx" }}
                    helperText={cvLoading ? "Extracting CV, please wait..." : "Upload your CV to auto-fill your profile"}
                    error={!!cvError}
                />





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
                                    options={Array.isArray(skillsList) ? skillsList : []}
                                    getOptionLabel={(o) => o.name}
                                    value={
                                        Array.isArray(skillsList)
                                            ? skillsList.find((x) => x.id === item.skill_id) || null
                                            : null
                                    }
                                    onChange={(e, v) => updateSkill(index, "skill_id", v?.id || null)}
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


                <Typography variant="h6" mt={4}>Experience</Typography>

                {experiences.map((item, index) => (
                    <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>

                        <TextField
                            fullWidth
                            label="Job Title"
                            value={item.job_title}
                            onChange={(e) => updateExperience(index, "job_title", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Company"
                            value={item.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    value={item.start_date}
                                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    value={item.end_date}
                                    onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={item.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            sx={{ mt: 2 }}
                        />

                        <Button color="error" sx={{ mt: 1 }} onClick={() => removeExperience(index)}>
                            Remove
                        </Button>
                    </Box>
                ))}

                <Button variant="outlined" sx={{ mt: 2 }} onClick={addExperience}>
                    + Add Experience
                </Button>




                <Typography variant="h6" mt={4}>Projects</Typography>

                {projects.map((item, index) => (
                    <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>

                        <TextField
                            fullWidth
                            label="Project Title"
                            value={item.title}
                            onChange={(e) => updateProject(index, "title", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Technologies"
                            value={item.technologies}
                            onChange={(e) => updateProject(index, "technologies", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={item.description}
                            onChange={(e) => updateProject(index, "description", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Project Link"
                            value={item.link}
                            onChange={(e) => updateProject(index, "link", e.target.value)}
                        />

                        <Button color="error" sx={{ mt: 1 }} onClick={() => removeProject(index)}>
                            Remove
                        </Button>
                    </Box>
                ))}

                <Button variant="outlined" sx={{ mt: 2 }} onClick={addProject}>
                    + Add Project
                </Button>



                <Typography variant="h6" mt={4}>Certifications</Typography>

                {certifications.map((item, index) => (
                    <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>

                        <TextField
                            fullWidth
                            label="Certification Title"
                            value={item.title}
                            onChange={(e) => updateCertification(index, "title", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Issuer"
                            value={item.issuer}
                            onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Issued Date"
                            value={item.date_issued}
                            onChange={(e) => updateCertification(index, "date_issued", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Credential ID"
                            value={item.credential_id}
                            onChange={(e) => updateCertification(index, "credential_id", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Credential URL"
                            value={item.credential_url}
                            onChange={(e) => updateCertification(index, "credential_url", e.target.value)}
                        />

                        <Button color="error" sx={{ mt: 1 }} onClick={() => removeCertification(index)}>
                            Remove
                        </Button>
                    </Box>
                ))}

                <Button variant="outlined" sx={{ mt: 2 }} onClick={addCertification}>
                    + Add Certification
                </Button>



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

                {/* SAVE BUTTON */}
                <Button variant="contained" sx={{ mt: 3 }} onClick={saveProfile}>
                    Save Profile
                </Button>
            </Box>

            {conflictModal && (
                <Dialog open onClose={() => setConflictModal(null)}>
                    <DialogTitle>Data Conflict Detected</DialogTitle>

                    <DialogContent>
                        <Typography>Choose which value to keep for:</Typography>
                        <Typography fontWeight="bold" sx={{ mt: 1 }}>
                            {conflictModal.field.replace("_", " ").toUpperCase()}
                        </Typography>

                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            variant="outlined"
                            onClick={() => applyChoice(conflictModal.field, conflictModal.current)}
                        >
                            Keep Existing: {conflictModal.current || "Empty"}
                        </Button>

                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => applyChoice(conflictModal.field, conflictModal.cv)}
                        >
                            Use CV Value: {conflictModal.cv}
                        </Button>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setConflictModal(null)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            )}


        </>
    );
}
