export default function FeaturedJobsSection({ jobs, singleColumn = false }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Featured Jobs
      </h2>

      <div className={`grid gap-6 ${singleColumn ? "grid-cols-1" : "md:grid-cols-2"}`}>
        {jobs.map((job) => (
          <div
            key={job.title}
            className="
              group
              rounded-2xl 
              bg-[#020617] 
              border border-[#1f2937]
              p-6 
              shadow-sm
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:shadow-lg
              transition
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{job.company}</p>
              </div>

              <span
                className="
                  px-3 py-1 
                  text-xs 
                  rounded-full 
                  bg-slate-800
                  text-blue-300
                  border border-slate-700/70
                  group-hover:bg-blue-600
                  group-hover:text-white
                  group-hover:border-blue-500
                  transition
                "
              >
                {job.tagLeft}
              </span>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-400">
                {job.tagRight || "—"}
              </span>

              <span className="text-sm font-semibold text-blue-300 group-hover:text-white transition">
                {job.salary}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
