import { useRouter } from "next/router";
import {
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
import { getToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/api";

export default function SkillDashboard() {
  const router = useRouter();
  const token = getToken();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const res = await apiRequest("/user/skills/", "GET", token);
      setSkills(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchSkills();
  }, []);

  if (loading)
    return (
      <Typography className="text-center mt-10 text-gray-400">
        Loading skills…
      </Typography>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Typography variant="h4" className="font-bold mb-5 text-white">
        Your Skill Progress
      </Typography>

      {skills.length === 0 && (
        <Typography className="text-gray-400 text-center mt-4">
          You have not added any skills yet.
        </Typography>
      )}

      {skills.map((item) => {
        const skill = item.skill;

        return (
          <Card
            key={item.id}
            className="shadow-lg mb-4 border"
            style={{ background: "#111", color: "white" }}
          >
            <CardContent>
              {/* Skill Name */}
              <Typography variant="h6" color="#00e676">
                {skill.name}
              </Typography>

              {/* Skill Category */}
              <Typography className="text-sm text-gray-400">
                Category: <strong>{skill.category?.name}</strong>
              </Typography>

              {/* Difficulty */}
              <Typography className="text-sm text-gray-400 mb-2">
                Difficulty: {skill.difficulty_level}
              </Typography>

              {/* Level */}
              <Typography className="text-gray-300 mb-1">
                Level:{" "}
                <strong className="text-green-400">{item.level}</strong>
              </Typography>

              {/* Proficiency Bar */}
              <LinearProgress
                variant="determinate"
                value={item.proficiency_percentage}
                sx={{
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: "#333",
                  mb: 1,
                }}
              />

              <Typography
                className="text-sm text-gray-400 mb-3"
                align="right"
              >
                {item.proficiency_percentage}%
              </Typography>

              {/* Continue Button */}
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#00e676" }}
                onClick={() =>
                  router.push(`/skills/tests?skill=${skill.id}`)
                }
              >
                Continue Test
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
