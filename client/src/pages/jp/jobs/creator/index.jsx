import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Drawer,
    Chip,
    Divider,
    Modal,
    TextField,
    IconButton,
    Autocomplete,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import { MdClose } from "react-icons/md";
import { userInfo } from "os";
import { useRouter } from "next/router";


export default function JobCreatorPage() {
    const token = getToken();
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [skills, setSkills] = useState([]);

    // drawer / pipeline
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [pipeline, setPipeline] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    // modal
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // delete
    const [deleteId, setDeleteId] = useState(null);

    // constants
    const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Mid", "Senior", "Lead"];
    const EMPLOYMENT_MODE = ["Remote", "Hybrid", "On-site"];
    const JOB_TYPES = ["Internship", "Part-time", "Full-time", "Freelance", "Contract"];

    // job form
    const [form, setForm] = useState({
        title: "",
        location: "",
        description: "",
        responsibilities: "",
        benefits: "",
        experience_level: [],
        employment_mode: [],
        job_type: [],
        required_skills: [],
        required_skill_ids: [],
        salary_min: "",
        salary_max: "",
        salary_currency: "BDT",
        deadline: "",
        screening_questions: "",
        company_profile: null,
    });

    const [formErrors, setFormErrors] = useState({});

    // ----------------------------------
    // FETCH SKILLS
    // ----------------------------------
    const fetchSkills = async () => {
        const res = await apiRequest("/dropdown/skills/", "GET", token);
        setSkills(res); // [{id, name}]
    };

    const [CompanyProfile, setCompanyProfile] = useState([]);


    const fetchCompanyInstitution = async () => {
        const res = await apiRequest("/auth/user-comapay-and-institution-profile/", "GET", token);
        setCompanyProfile(res?.company_profiles); // [{id, name}]
    };

    console.log(CompanyProfile)

    // ----------------------------------
    // FETCH JOBS CREATED BY COMPANY
    // ----------------------------------
    const fetchJobs = async () => {
        const res = await apiRequest("/jobs/creator/", "GET", token);
        setJobs(res.jobs);
    };

    useEffect(() => {
        fetchJobs();
        fetchSkills();
        fetchCompanyInstitution();
    }, []);

    // ----------------------------------
    // SAVE JOB (CREATE / EDIT)
    // ----------------------------------
    const saveJob = async () => {
  const payload = {
    ...form,
    required_skill_ids: form.required_skills.map((s) => s.id),
  };

  setFormErrors({}); // clear old errors

  try {
    if (isEditing) {
      await apiRequest(`/jobs/${form.id}/`, "PUT", token, payload);
    } else {
      await apiRequest(`/jobs/`, "POST", token, payload);
    }

    // success:
    setModalOpen(false);
    fetchJobs();

  } catch (err) {
    console.log("Backend Errors:", err);

    // DRF validation errors look like: { title: ["This field is required"] }
    setFormErrors(err);

    // ❗ DO NOT CLOSE MODAL — user must fix errors
  }
};


    // ----------------------------------
    // DELETE JOB
    // ----------------------------------
    const deleteJob = async () => {
        await apiRequest(`/jobs/${deleteId}/`, "DELETE", token);
        setDeleteId(null);
        fetchJobs();
    };

    // ----------------------------------
    // OPEN EDIT MODAL
    // ----------------------------------
    const openEdit = (job) => {
        setForm({
            ...job,
            required_skills: job.required_skills || [],
            required_skill_ids: job.required_skills?.map((s) => s.id) || [],
        });
        setIsEditing(true);
        setModalOpen(true);
    };

    // ----------------------------------
    // OPEN CREATE MODAL
    // ----------------------------------
    const openCreate = () => {
        setForm({
            title: "",
            location: "",
            description: "",
            responsibilities: "",
            benefits: "",
            experience_level: [],
            employment_mode: [],
            job_type: [],
            required_skills: [],
            required_skill_ids: [],
            salary_min: "",
            salary_max: "",
            salary_currency: "BDT",
            deadline: "",
            screening_questions: "",
        });

        setIsEditing(false);
        setModalOpen(true);
    };

    // ----------------------------------
    // PIPELINE
    // ----------------------------------
    const openPipeline = async (job) => {
        setSelectedJob(job);
        const res = await apiRequest(`/jobs/${job.id}/pipeline/`, "GET", token);
        setPipeline(res.pipeline);
        setDrawerOpen(true);
    };

    useEffect(() => {
        if (!userInfo?.is_company ) {
            router.push("/jp/jobs");
        }
    }, [userInfo]);


    return (
        <Grid container p={3} spacing={3}>
            {/* HEADER */}
            <Grid item xs={12} display="flex" justifyContent="space-between">
                <Typography variant="h4" color="#fff">
                    Manage Jobs
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreate}
                    sx={{ bgcolor: "#00e676" }}
                >
                    Create Job
                </Button>
            </Grid>

            {/* JOB LIST */}
            {/* JOB LIST */}
<Grid item xs={12}>
  <Grid container spacing={2}>
    {jobs.map((job) => (
      <Grid item xs={12} md={6} key={job.id}>
        <Card
          onClick={() => openPipeline(job)}
          sx={{
            p: 2,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            cursor: "pointer",
            transition: "0.25s",
            "&:hover": {
              transform: "translateY(-5px)",
              borderColor: "#00e676",
              boxShadow: "0 4px 25px rgba(0, 230, 118, 0.25)",
            },
          }}
        >
          {/* HEADER SECTION */}
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src={job.company_info?.logo}
              alt="Logo"
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                objectFit: "cover",
                border: "1px solid #333",
              }}
            />

            <Box>
              <Typography variant="h6" sx={{ color: "#00e676", fontWeight: "bold" }}>
                {job.title}
              </Typography>

              <Typography variant="body2" sx={{ color: "gray" }}>
                {job.company_info?.company_name}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                📍 {job.location}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: "#333" }} />

          {/* TAG SECTION */}
          <Box display="flex" flexWrap="wrap" gap={1}>

            {/* Experience levels */}
            {job.experience_level.map((lvl, i) => (
              <Chip key={i} label={lvl} size="small" sx={{ bgcolor: "#222", color: "#00e676" }} />
            ))}

            {/* Job Types */}
            {job.job_type.map((type, i) => (
              <Chip key={i} label={type} size="small" sx={{ bgcolor: "#111", border: "1px solid #333" }} />
            ))}

            {/* Employment modes */}
            {job.employment_mode.map((mode, i) => (
              <Chip
                key={i}
                label={mode}
                size="small"
                sx={{ bgcolor: "rgba(0,230,118,0.1)", color: "#00e676" }}
              />
            ))}
          </Box>

          {/* SKILLS */}
          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            {job.required_skills.map((skill) => (
              <Chip
                key={skill.id}
                label={skill.name}
                size="small"
                sx={{ bgcolor: "#1f1f1f", border: "1px solid #333" }}
              />
            ))}
          </Box>

          {/* SALARY */}
          <Typography sx={{ mt: 2, fontSize: 14 }}>
            💰 Salary:{" "}
            <b>
              {job.salary_min} – {job.salary_max} {job.salary_currency}
            </b>
          </Typography>

          {/* FOOTER ACTIONS */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography fontSize={13}>
              Applicants: <b>{job.applicants_count}</b>
            </Typography>

            <Box display="flex" gap={1}>
              <IconButton sx={{ color: "orange" }} onClick={(e) => { e.stopPropagation(); openEdit(job); }}>
                <EditIcon />
              </IconButton>

              <IconButton sx={{ color: "red" }} onClick={(e) => { e.stopPropagation(); setDeleteId(job.id); }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
</Grid>


            {/* CREATE / EDIT MODAL */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box className="no-scrollbar border "
                    sx={{
                        width: { xs: "100%", md: "60%" },
                        bgcolor: "#111",
                        color: "#fff",
                        p: 4,
                        mt: 2,
                        borderRadius: 2,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}
                >

                    <Typography variant="h6" mb={2} color="#00e676">
                        {isEditing ? "Edit Job" : "Create New Job"}
                    </Typography>

                    <IconButton
                        sx={{ position: "absolute", top: 10, right: 10 }}
                        onClick={() => setModalOpen(false)}
                    >
                        <MdClose />
                    </IconButton>


                    <Autocomplete
                        options={CompanyProfile}
                        getOptionLabel={(option) => option.company_name}
                        value={
                            CompanyProfile.find((c) => c.id === form.company_profile) || null
                        }
                        onChange={(_, value) =>
                            setForm({ ...form, company_profile: value ? value.id : null })
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Select Company Profile" sx={{ mb: 2 }} />
                        )}
                    />


                    {/* Title */}
                    <TextField
                        label="Job Title"
                        fullWidth
                        error={formErrors.title ? true : false}
                        helperText={formErrors.title}
                        sx={{ mb: 2 }}
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />

                    {/* Location */}
                    <TextField
                        label="Location"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={formErrors.location ? true : false}
                        helperText={formErrors.location}
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />

                    {/* Description */}
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        minRows={3}
                        error={formErrors.description ? true : false}
                        helperText={formErrors.description}
                        sx={{ mb: 2 }}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    {/* Responsibilities */}
                    <TextField
                        label="Responsibilities"
                        fullWidth
                        multiline
                        error={formErrors.Responsibilities ? true : false}
                        helperText={formErrors.Responsibilities}
                        rows={3}
                        sx={{ mb: 2 }}
                        value={form.responsibilities}
                        onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                    />

                    {/* Benefits */}
                    <TextField
                        label="Benefits"
                        fullWidth
                        multiline
                        error={formErrors.benefits ? true : false}
                        helperText={formErrors.benefits}
                        rows={2}
                        sx={{ mb: 2 }}
                        value={form.benefits}
                        onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    />

                    {/* Experience Level */}
                    <Autocomplete
                        multiple
                        error={formErrors.experience_level ? true : false}
                        helperText={formErrors.experience_level}
                        options={EXPERIENCE_LEVELS}
                        value={form.experience_level}
                        onChange={(_, value) => setForm({ ...form, experience_level: value })}
                        renderInput={(params) => (
                            <TextField {...params} label="Experience Level" sx={{ mb: 2 }} />
                        )}
                    />

                    {/* Employment Mode */}
                    <Autocomplete
                        multiple
                        error={formErrors.employment_mode ? true : false}
                        helperText={formErrors.employment_mode}
                        options={EMPLOYMENT_MODE}
                        value={form.employment_mode}
                        onChange={(_, value) => setForm({ ...form, employment_mode: value })}
                        renderInput={(params) => (
                            <TextField {...params} label="Employment Mode" sx={{ mb: 2 }} />
                        )}
                    />

                    {/* Job Type */}
                    <Autocomplete
                        multiple
                        error={formErrors.job_type ? true : false}
                        helperText={formErrors.job_type}
                        options={JOB_TYPES}
                        value={form.job_type}
                        onChange={(_, value) => setForm({ ...form, job_type: value })}
                        renderInput={(params) => (
                            <TextField {...params} label="Job Type" sx={{ mb: 2 }} />
                        )}
                    />

                    {/* Skills */}
                    <Autocomplete
                        multiple
                        error={formErrors.required_skills ? true : false}
                        helperText={formErrors.required_skills}
                        options={skills}
                        getOptionLabel={(option) => option.name}
                        value={form.required_skills}
                        onChange={(_, selected) =>
                            setForm({
                                ...form,
                                required_skills: selected,
                                required_skill_ids: selected.map((s) => s.id),
                            })
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Required Skills" sx={{ mb: 2 }} />
                        )}
                    />

                    {/* Salary */}
                    <Box display="flex" gap={2}>
                        <TextField
                            label="Min Salary"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            error={formErrors.salary_min ? true : false}
                            helperText={formErrors.salary_min}
                            fullWidth
                            sx={{ mb: 2 }}
                            value={form.salary_min}
                            onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                        />

                        <TextField
                            label="Max Salary"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            error={formErrors.salary_max ? true : false}
                            helperText={formErrors.salary_max}
                            fullWidth
                            sx={{ mb: 2 }}
                            value={form.salary_max}
                            onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                        />
                    </Box>

                    {/* Deadline */}
                    <TextField
                        label="Deadline"
                        type="date"
                        InputProps={{ inputProps: { min: new Date().toISOString().split("T")[0] } }}
                        error={formErrors.deadline ? true : false}
                        helperText={formErrors.deadline}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    />

                    {/* Screening Questions */}
                    <TextField
                        label="Screening Questions (JSON)"
                        fullWidth
                        multiline
                        error={formErrors.screening_questions ? true : false}
                        helperText={formErrors.screening_questions}
                        rows={2}
                        sx={{ mb: 3 }}
                        value={form.screening_questions}
                        onChange={(e) => setForm({ ...form, screening_questions: e.target.value })}
                    />

                    <Button variant="contained" fullWidth onClick={saveJob}>
                        {isEditing ? "Update Job" : "Create Job"}
                    </Button>
                </Box>
            </Modal>

            {/* DELETE MODAL */}
            <Modal open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
                <Box
                    sx={{
                        width: 350,
                        bgcolor: "#111",
                        color: "#fff",
                        p: 4,
                        borderRadius: 2,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <Typography mb={2}>Delete this job permanently?</Typography>

                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={deleteJob}
                        sx={{ mb: 1 }}
                    >
                        Delete
                    </Button>

                    <Button variant="outlined" fullWidth onClick={() => setDeleteId(null)}>
                        Cancel
                    </Button>
                </Box>
            </Modal>

            {/* PIPELINE DRAWER */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: { width: "60%", bgcolor: "#111", color: "white", p: 3 },
                }}
            >
                {selectedJob && (
                    <>
                        <Typography variant="h4">{selectedJob.title}</Typography>
                        <Divider sx={{ my: 2 }} />

                        {pipeline &&
                            Object.entries(pipeline).map(([stage, applicants]) => (
                                <Box key={stage} mb={2}>
                                    <Typography variant="h6" color="#00e676">
                                        {stage} ({applicants.length})
                                    </Typography>

                                    {applicants.map((app) => (
                                        <Card key={app.id} sx={{ mt: 1, background: "#222" }}>
                                            <CardContent>
                                                <Typography>{app.user.full_name}</Typography>
                                                <Typography fontSize={12} color="gray">
                                                    {app.user.email}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            ))}
                    </>
                )}
            </Drawer>
        </Grid>
    );
}
