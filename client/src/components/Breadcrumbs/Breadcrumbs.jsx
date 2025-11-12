"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import useTranslate from "@/hooks/useTranslation";

const STATIC_LABELS = {
  home: "Home",
  study: "Study",
  "book-list": "Book List",
  "generated-question": "Question List",
  "omr-sheet": "OMR Sheet",
  exam: "Exam",
  "online-exam": "Online Exam",
  "question-pattern": "Question Pattern",
  "mcq-question": "Archive Questions",
  "mentorship-program": "Mentorship Program",
  "mock-test": "Mock Test",
  "question-bank": "Question Bank",
  "preset-exams": "Preset Exams",
  profile: "Profile",
  reference: "Reference",
  "quick-practice": "Quick Practice",
  "selected-question": "Selected Question",
};

function toTitleCase(s) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({
  className = "",
  rootLabel = "Home",
  basePath = "/",
  lastIsLink = true,
  notShowLast = false,   // ✅ new prop
}) {
  const router = useRouter();
  const { t } = useTranslate();

  const cleanPath = router.asPath.split("#")[0].split("?")[0];
  const parts = cleanPath.split("/").filter(Boolean);

  const items = [];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    const raw = decodeURIComponent(parts[i]);
    acc += `/${raw}`;
    const staticLabel = STATIC_LABELS[raw?.toLowerCase()];
    const label = staticLabel ? t(staticLabel) : toTitleCase(raw);
    items.push({ href: acc || "/", label, isLast: i === parts.length - 1 });
  }

  if (basePath !== "/" && items.length) {
    const dropUntil = basePath.split("/").filter(Boolean).length;
    items.splice(0, dropUntil);
  }

  return (
    <nav aria-label="Breadcrumb" className={`text-sm flex items-center flex-wrap gap-2 ${className}`}>
      <Link href="/" className="text-primary hover:underline">{t(rootLabel)}</Link>

      {items.map((it) => {
        if (notShowLast && it.isLast) return null; // ✅ skip last one
        return (
          <span key={it.href} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {it.isLast && !lastIsLink ? (
              <span className="text-gray-600 dark:text-gray-300">{it.label}</span>
            ) : (
              <Link
                href={it.href}
                className={`hover:underline ${
                  it.isLast ? "text-primary/80" : "text-primary"
                }`}
              >
                {it.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
