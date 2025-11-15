import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import useTranslate from "@/hooks/useTranslation";

const LOCATIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Remote",
];

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const {t} = useTranslate()

  const handleSearch = (e) => {
    e.preventDefault();

    // build query params
    const query = {};
    if (keyword.trim()) query.keyword = keyword.trim();
    if (location) query.location = location;

    // 🔁 change "/jobs" to whatever your jobs page is
    router.push({
      pathname: "/jobs",
      query,
    });
  };

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: TEXT + SEARCH UI */}
        <div>
          <h1 className="text-4xl dark:text-white sm:text-5xl font-extrabold text-gray-900 leading-tight">
            {t("Find Your")} <br />
            <span className="text-primary">{("Dream Job")}</span>
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300 text-base">
            {t("Search and apply for the latest job openings")}
          </p>

          {/* Search form (uses MUI TextField + Button so theme applies) */}
          {/* <form onSubmit={handleSearch} className="mt-8">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 9999,
                  },
                }}
              />

              <TextField
                select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 9999,
                  },
                }}
              >
                <MenuItem value="">Location</MenuItem>
                {LOCATIONS.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                size="medium"
                sx={{
                  borderRadius: 9999,
                  whiteSpace: "nowrap",
                  px: 3,
                }}
              >
                Search
              </Button>
            </Box>
          </form> */}

        </div>

        {/* RIGHT: HERO IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <Image
            src="/HomeIcon/hero-girl-blue.png" // make sure this path matches your file
            width={520}
            height={520}
            alt="Hero illustration"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
