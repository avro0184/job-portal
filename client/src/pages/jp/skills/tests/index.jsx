import { useEffect, useState } from "react";
import apiRequest from "@/utils/apiRequest";
import Link from "next/link";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function TestListPage() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    apiRequest("/skills/tests/", "GET")
      .then((res) => setTests(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Skill Tests</h1>

      <div className="grid gap-4">
        {tests?.map((test) => (
          <Card key={test.id} className="shadow-md border">
            <CardContent>
              <Typography variant="h6">{test.title}</Typography>
              <Typography variant="body2" className="text-gray-600 my-2">
                {test.description}
              </Typography>
              <Link href={`/skills/tests/${test.id}`}>
                <Button variant="contained" color="primary">
                  Start Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
