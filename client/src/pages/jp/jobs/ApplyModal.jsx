import {
    Modal,
    TextField,
    Fade,
    CircularProgress,
    Box,
    Typography,
    Button
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState } from "react";
import apiRequest from "@/utils/api";
import { getToken } from "@/utils/auth";
import toast from "react-hot-toast";

const ApplyModal = ({ open, onClose, job  }) => {
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const token = getToken();

    const handleAnswerChange = (index, value) => {
        setAnswers((prev) => ({
            ...prev,
            [index]: value,
        }));
    };

    const submitApplication = async () => {
        setErrors({});

        if (!coverLetter.trim()) {
            setErrors({ coverLetter: "Cover letter is required" });
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("cover_letter", coverLetter);
            formData.append("screening_answers", JSON.stringify(answers));
            if (resume) formData.append("resume", resume);

            const endpoint = `/jobs/${job.id}/apply/`;

            const res = await apiRequest(endpoint, "POST", token, formData, null, true);
            if (res.success) {
                toast.success("Application submitted successfully!");
            }
            onClose();
        } catch (error) {
            console.log(error);
            alert("Failed to apply!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
                <Box
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "#111",
                        color: "#fff",
                        p: 3,
                        borderRadius: 3,
                        width: { xs: "90%", md: "500px" },
                        border: "1px solid #333",
                        outline: "none",
                        zIndex: 99999,
                    }}
                >
                    <Typography variant="h5" color="#00e676" mb={2}>
                        Apply for {job?.title}
                    </Typography>

                    {/* Resume Upload (Optional) */}
                    <Button
                        component="label"
                        fullWidth
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        sx={{
                            borderColor: "#00e676",
                            color: "#00e676",
                            mb: 2,
                        }}
                    >
                        Upload Resume (Optional)
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setResume(e.target.files[0])}
                        />
                    </Button>

                    {resume && (
                        <Typography fontSize={13} color="#00e676" mb={2}>
                            Selected: {resume.name}
                        </Typography>
                    )}

                    {/* Cover Letter */}
                    <TextField
                        label="Cover Letter (Required)"
                        fullWidth
                        multiline
                        rows={3}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        error={!!errors.coverLetter}
                        helperText={errors.coverLetter}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                bgcolor: "#222",
                                color: "#fff",
                                borderRadius: 2,
                                "& fieldset": {
                                    borderColor: "#444",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00e676",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00e676",
                                },
                            },
                            "& .MuiOutlinedInput-input": {
                                color: "#fff",
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: "#888",
                                opacity: 1,
                            },
                            "& .MuiInputLabel-root": {
                                color: "#aaa",
                                "&.Mui-focused": {
                                    color: "#00e676",
                                },
                            },
                        }}
                    />


                    {/* Screening Questions */}
                    {job?.screening_questions?.length > 0 && (
                        <Box>
                            <Typography mb={1} fontWeight="bold">
                                Screening Questions
                            </Typography>

                            {job.screening_questions.map((question, index) => (
                                <Box key={index} mb={2}>
                                    <Typography mb={1}>{question}</Typography>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={answers[index] || ""}
                                        placeholder="Your answer..."
                                        onChange={(e) =>
                                            handleAnswerChange(index, e.target.value)
                                        }
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: "#222",
                                                color: "#fff",
                                                borderRadius: 2,
                                                "& fieldset": {
                                                    borderColor: "#444",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#00e676",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#00e676",
                                                },
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                color: "#fff",
                                            },
                                            "& .MuiInputBase-input::placeholder": {
                                                color: "#888",
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Submit */}
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={submitApplication}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Submit Application"}
                    </Button>
                </Box>
        </Modal>
    );
};

export default ApplyModal;