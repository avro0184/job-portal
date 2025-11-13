import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";

const popularTags = [
  { label: "React Developer", value: "React Developer" },
  { label: "Remote Jobs", value: "Remote" },
  { label: "Frontend Developer", value: "Frontend" },
  { label: "Data Analyst", value: "Data Analyst" },
  { label: "Internships", value: "Internship" },
];

export default function PopularTags() {
  const router = useRouter();

  const handleClick = (value) => {
    router.push({
      pathname: "/jobs",
      query: { keyword: value },
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-3">
        Popular Searches
      </h3>

      <div className="flex flex-col gap-3 w-full">
        {popularTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => handleClick(tag.value)}
            className="
              group flex items-center gap-3
              w-full
              px-4 py-2.5
              rounded-2xl
              bg-[#020617]
              border border-slate-700/70
              text-sm font-medium
              text-slate-100
              shadow-sm
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:shadow-lg
              transition
            "
          >
            <span
              className="
                flex h-8 w-8 items-center justify-center
                rounded-xl
                bg-slate-800
                text-blue-300
                group-hover:bg-blue-600
                group-hover:text-white
                transition
              "
            >
              <FaSearch className="text-xs" />
            </span>

            <span className="group-hover:text-white transition">
              {tag.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
