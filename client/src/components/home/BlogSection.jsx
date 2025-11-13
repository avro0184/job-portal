import {
  FaArrowRight,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

const defaultPosts = [
  {
    title: "How to Land Your First Developer Job",
    excerpt: "Practical tips on building a portfolio, writing a strong CV, and preparing for technical interviews.",
    date: "Nov 10, 2025",
    tag: "Career Tips",
  },
  {
    title: "Top 10 Skills Companies Look For in 2025",
    excerpt: "A breakdown of the most in-demand technical and soft skills recruiters are searching for.",
    date: "Nov 05, 2025",
    tag: "Trends",
  },
  {
    title: "Remote Work: How to Stand Out in Global Talent Pools",
    excerpt: "Learn how to position yourself for remote-friendly roles across the world.",
    date: "Oct 28, 2025",
    tag: "Remote Jobs",
  },
];

export default function BlogSection({ posts = defaultPosts }) {
  return (
    <aside className="w-full">
      <h2 className="text-2xl font-semibold text-white">
        Latest from the Blog
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Insights and tips to grow your career.
      </p>

      <div className="mt-5 space-y-4">
        {posts.map((post) => (
          <button
            key={post.title}
            className="
              group w-full text-left
              flex gap-3
              rounded-2xl
              bg-[#020617]
              border border-slate-700/70
              px-4 py-3
              shadow-sm
              hover:border-blue-500
              hover:bg-blue-950/40
              hover:shadow-lg
              transition
            "
          >
            {/* Thumbnail / Icon block */}
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-xl
                bg-slate-800
                text-blue-300
                group-hover:bg-blue-600
                group-hover:text-white
                transition
              "
            >
              <FaArrowRight className="text-sm" />
            </div>

            {/* Text block */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition">
                {post.title}
              </h3>

              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <FaCalendarAlt className="text-[10px]" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaTag className="text-[10px]" />
                  {post.tag}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-5 flex justify-end">
        <button
          className="
            inline-flex items-center gap-2
            text-xs font-medium
            text-blue-300
            hover:text-white
            transition
          "
        >
          View all posts
          <FaArrowRight className="text-[10px]" />
        </button>
      </div>
    </aside>
  );
}
