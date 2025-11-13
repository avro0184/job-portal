import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/apiRequest";
import { Card, CardContent, Typography, Radio, Button } from "@mui/material";

export default function TakeTestPage() {
  const router = useRouter();
  const { id } = router.query;

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    apiRequest(`/skills/tests/${id}/`, "GET")
      .then((data) => {
        setTest(data);

        const initialAnswers = {};
        data.questions.forEach((q) => (initialAnswers[q.id] = ""));
        setAnswers(initialAnswers);
      })
      .catch((err) => setError(err.error));
  }, [id]);

  const handleSelect = (qid, val) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = async () => {
    const filled = Object.values(answers).filter((x) => x !== "").length;

    if (filled !== 15) {
      setError("All 15 questions must be answered!");
      return;
    }

    try {
      const res = await apiRequest(
        `/skills/tests/${id}/submit/`,
        "POST",
        localStorage.getItem("access_token"),
        { answers }
      );

      router.push({
        pathname: "/skills/result",
        query: {
          score: res.score,
          percentage: res.percentage,
          passed: res.passed,
        },
      });
    } catch (err) {
      setError(err.error || "Unable to submit test");
    }
  };

  if (!test) return <div className="p-10">Loading...</div>;
  if (error) return <div className="text-red-600 p-5">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Typography variant="h4" className="font-bold mb-6">
        {test.title}
      </Typography>

      {test.questions.map((q, i) => (
        <Card key={q.id} className="mb-6 border shadow">
          <CardContent>
            <Typography variant="h6">
              {i + 1}. {q.question_text}
            </Typography>

            {["A", "B", "C", "D"].map((opt) => (
              <div key={opt} className="flex items-center mt-2">
                <Radio
                  checked={answers[q.id] === opt}
                  onChange={() => handleSelect(q.id, opt)}
                />
                <Typography>
                  {opt}. {q[`option_${opt.toLowerCase()}`]}
                </Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" color="success" onClick={handleSubmit}>
        Submit Test
      </Button>
    </div>
  );
}
