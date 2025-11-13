import {
  FaBriefcase,
  FaBuilding,
  FaGlobeAmericas,
  FaUserCheck,
} from "react-icons/fa";

const defaultStats = [
  {
    label: "Active Job Vacancies",
    value: "12,345+",
    sub: "Across all categories",
    icon: FaBriefcase,
  },
  {
    label: "Companies Hiring",
    value: "780+",
    sub: "From startups to enterprises",
    icon: FaBuilding,
  },
  {
    label: "Remote Friendly Roles",
    value: "3,200+",
    sub: "Work from anywhere",
    icon: FaGlobeAmericas,
  },
  {
    label: "New Jobs This Week",
    value: "540+",
    sub: "Fresh opportunities added",
    icon: FaUserCheck,
  },
];

export default function StatsSection({ stats = defaultStats }) {
  return (
    <section className="w-full bg-[#111827]">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="
                  group flex items-start gap-3
                  rounded-2xl
                  bg-[#020617]
                  border border-slate-700/70
                  px-4 py-4
                  shadow-sm
                  hover:border-blue-500
                  hover:bg-blue-950/40
                  hover:shadow-lg
                  transition
                "
              >
                {/* Icon */}
                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-slate-800
                    text-blue-300
                    group-hover:bg-blue-600
                    group-hover:text-white
                    transition
                  "
                >
                  <Icon className="text-lg" />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white leading-tight">
                    {item.value}
                  </span>

                  <span className="text-xs text-gray-400 mt-0.5">
                    {item.label}
                  </span>

                  {item.sub && (
                    <span className="text-[11px] text-gray-500 mt-1">
                      {item.sub}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
