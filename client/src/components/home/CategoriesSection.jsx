import {
  FaCode,
  FaBullhorn,
  FaChartBar,
  FaPaintBrush,
  FaCalculator,
  FaUsers,
  FaDollarSign,
  FaHeadset,
  FaBriefcase,
} from "react-icons/fa";

const iconMap = {
  "Software Development": FaCode,
  Marketing: FaBullhorn,
  "Data Science": FaChartBar,
  Design: FaPaintBrush,
  Accounting: FaCalculator,
  "Human Resources": FaUsers,
  Sales: FaDollarSign,
  "Customer Support": FaHeadset,
};

export default function CategoriesSection({ categories }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-white">
        Browse by Category
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Find jobs that match your skills.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat] || FaBriefcase;

          return (
            <button
              key={cat}
              className="
                group flex items-center gap-3
                rounded-2xl
                bg-[#020617]
                border border-slate-700/70
                px-4 py-3
                text-sm font-medium text-slate-100
                shadow-sm
                hover:border-blue-500
                hover:bg-blue-950/40
                hover:shadow-lg
                transition
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-slate-800
                  text-blue-300
                  group-hover:bg-blue-600
                  group-hover:text-white
                  transition
                "
              >
                <Icon className="text-lg" />
              </span>

              <span className="text-left flex-1">
                {cat}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
