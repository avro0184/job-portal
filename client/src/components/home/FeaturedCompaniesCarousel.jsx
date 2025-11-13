import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaBriefcase } from "react-icons/fa";
import Image from "next/image";

const featuredCompanies = [
  {
    name: "Google",
    logo: "/logos/google.png",
    tagline: "Building the future of search.",
    jobs: "25+ open roles",
  },
  {
    name: "Microsoft",
    logo: "/logos/microsoft.png",
    tagline: "Empowering every person and organization.",
    jobs: "18+ open roles",
  },
  {
    name: "Meta",
    logo: "/logos/meta.png",
    tagline: "Connecting people and communities.",
    jobs: "12+ open roles",
  },
  {
    name: "Amazon",
    logo: "/logos/amazon.png",
    tagline: "Customer-obsessed innovation.",
    jobs: "30+ open roles",
  },
  {
    name: "Netflix",
    logo: "/logos/netflix.png",
    tagline: "Entertainment at global scale.",
    jobs: "7+ open roles",
  },
];

export default function FeaturedCompaniesCarousel({
  companies = featuredCompanies,
}) {
  const scrollRef = useRef(null);

  const scrollByAmount = (amount) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Featured Companies
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Trusted brands actively hiring on the platform.
          </p>
        </div>

        {/* Arrows (desktop only) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-250)}
            className="
              flex items-center justify-center
              h-9 w-9
              rounded-full
              bg-[#020617]
              border border-slate-700/70
              text-slate-300
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:text-white
              transition
            "
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(250)}
            className="
              flex items-center justify-center
              h-9 w-9
              rounded-full
              bg-[#020617]
              border border-slate-700/70
              text-slate-300
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:text-white
              transition
            "
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="
          flex gap-4
          overflow-x-auto
          pb-2
          custom-scrollbar
        "
      >
        {companies.map((company) => (
          <button
            key={company.name}
            className="
              group min-w-[220px] sm:min-w-[240px]
              flex flex-col
              rounded-2xl
              bg-[#020617]
              border border-slate-700/70
              px-4 py-3
              text-left
              shadow-sm
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:shadow-lg
              transition
            "
          >
            <div className="flex items-center gap-3">
              {/* Logo / fallback icon */}
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-slate-800
                  text-blue-300
                  group-hover:bg-blue-600
                  group-hover:text-white
                  transition
                  overflow-hidden
                "
              >
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <FaBriefcase className="text-sm" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition">
                  {company.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {company.tagline}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{company.jobs}</span>
              <span className="text-blue-300 group-hover:text-white transition">
                View jobs →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
