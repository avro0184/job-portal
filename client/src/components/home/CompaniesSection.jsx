import { FaBuilding } from "react-icons/fa";

export default function CompaniesSection({ companies }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-white">Top Companies</h2>
      <p className="mt-1 text-sm text-slate-400">
        Explore companies actively hiring.
      </p>

      <div className="mt-5 flex flex-wrap gap-4">
        {companies.map((company) => (
          <button
            key={company}
            className="
              group flex items-center gap-3
              px-5 py-2.5
              rounded-2xl
              bg-[#020617]
              text-slate-100
              text-sm font-medium
              border border-slate-700/70
              shadow-sm
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:shadow-lg
              transition
            "
          >
            {/* Icon */}
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
              <FaBuilding className="text-sm" />
            </span>

            {/* Company name */}
            <span className="transition group-hover:text-white">
              {company}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
