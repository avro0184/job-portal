import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

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
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: TEXT + SEARCH UI */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Find Your <br />
            <span className="text-blue-600">Dream Job</span>
          </h1>

          <p className="mt-4 text-gray-600 text-base">
            Search and apply for the latest job openings
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mt-8 space-y-4">
            {/* Job Input + Search Button */}
            <div className="flex items-center bg-white border rounded-full shadow-sm overflow-hidden">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                className="flex-1 px-4 py-3 text-gray-700 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {/* Location select */}
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none rounded-full border bg-white px-4 py-3 pr-10 text-gray-700 shadow-sm outline-none cursor-pointer"
              >
                <option value="">Location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              {/* simple dropdown arrow */}
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400 text-xs">
                ▼
              </span>
            </div>
          </form>
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
