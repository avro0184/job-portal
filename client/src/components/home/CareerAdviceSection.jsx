import {
  FaFileAlt,
  FaComments,
  FaChartLine,
  FaHandshake,
} from "react-icons/fa";

const guides = [
  {
    title: "How to Write a Killer CV",
    description:
      "Structure your resume, highlight your achievements, and pass ATS filters with ease.",
    icon: FaFileAlt,
    tag: "CV & Resume",
  },
  {
    title: "Common Interview Questions",
    description:
      "Prepare for HR and technical interviews with real-world sample questions and answers.",
    icon: FaComments,
    tag: "Interviews",
  },
  {
    title: "Top In-Demand Skills in 2025",
    description:
      "See which technical and soft skills are trending across industries this year.",
    icon: FaChartLine,
    tag: "Skills & Growth",
  },
  {
    title: "Salary Negotiation Guides",
    description:
      "Learn how to research salary ranges and negotiate offers with confidence.",
    icon: FaHandshake,
    tag: "Salary & Offers",
  },
];

export default function CareerAdviceSection() {
  return (
    <section className="mt-12 w-full bg-[#111827]">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Career Advice & Guides
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Learn how to level up your job search and grow your career faster.
            </p>
          </div>

          {/* optional small label */}
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Updated regularly for job seekers like you
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <button
                key={guide.title}
                className="
                  group flex flex-col items-start
                  h-full
                  rounded-2xl
                  bg-[#020617]
                  border border-slate-700/70
                  px-4 py-4
                  text-left
                  shadow-sm
                  hover:border-blue-500
                  hover:bg-blue-950/40
                  hover:shadow-lg
                  transition
                "
              >
                {/* Icon + tag */}
                <div className="flex items-center gap-2 mb-3">
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
                    <Icon className="text-base" />
                  </span>

                  <span className="text-[11px] px-2 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700/60">
                    {guide.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition">
                  {guide.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {guide.description}
                </p>

                <span className="mt-3 text-[11px] text-blue-300 group-hover:text-white transition">
                  Read guide →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
