import { useState } from "react";
import { FaFilter, FaHome, FaClock, FaSuitcase } from "react-icons/fa";

const jobTypes = [
  { key: "full-time", label: "Full-Time", icon: FaSuitcase },
  { key: "part-time", label: "Part-Time", icon: FaClock },
  { key: "remote", label: "Remote", icon: FaHome },
];

export default function JobFilters({ onApply }) {
  const [selectedJobType, setSelectedJobType] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const handleApply = () => {
    onApply?.({
      jobType: selectedJobType,
      level,
      location,
      salary,
    });
  };

  const handleClear = () => {
    setSelectedJobType("");
    setLevel("");
    setLocation("");
    setSalary("");
    onApply?.({
      jobType: "",
      level: "",
      location: "",
      salary: "",
    });
  };

  return (
    <div className="mt-6 rounded-2xl bg-[#020617] border border-slate-700/70 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-blue-300">
          <FaFilter className="text-xs" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-white">Filter Jobs</h3>
          <p className="text-[11px] text-slate-500">
            Narrow down results quickly.
          </p>
        </div>
      </div>

      {/* Job type pills */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Job Type</p>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setSelectedJobType((prev) => (prev === key ? "" : key))
              }
              className={`
                group inline-flex items-center gap-2 px-3 py-1.5
                rounded-xl border text-xs font-medium
                ${
                  selectedJobType === key
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-[#111827] border-slate-700/70 text-slate-200 hover:border-blue-500 hover:bg-blue-950/40"
                }
                transition
              `}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-800 text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition">
                <Icon className="text-[9px]" />
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience level */}
      <div className="mb-3">
        <p className="text-xs text-slate-400 mb-1">Experience Level</p>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-xl bg-[#111827] border border-slate-700/70 px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="">Any level</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-3">
        <p className="text-xs text-slate-400 mb-1">Location</p>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City / Remote"
          className="w-full rounded-xl bg-[#111827] border border-slate-700/70 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* Salary */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-1">Salary Range</p>
        <select
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full rounded-xl bg-[#111827] border border-slate-700/70 px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="">Any</option>
          <option value="40-60">৳40k – 60k</option>
          <option value="60-80">৳60k – 80k</option>
          <option value="80+">৳80k+</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] text-slate-500 hover:text-slate-300 transition"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="
            px-4 py-2
            rounded-xl
            bg-blue-600
            text-[12px] font-semibold text-white
            hover:bg-blue-700
            transition
          "
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
