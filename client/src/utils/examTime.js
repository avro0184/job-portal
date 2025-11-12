// utils/examTime.js

export function toDateTime(dateStr, timeStr) {
  // Safely combine date + time into a Date object
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr}T${timeStr}`);
}

/**
 * Determine the current exam state
 * - "upcoming" if now < start
 * - "live" if start <= now <= end
 * - "past" if now > end
 */
export function getExamState(exam) {
  if (!exam?.exam_start_date || !exam?.start_time) return "unknown";

  const now = new Date();

  const start = toDateTime(exam.exam_start_date, exam.start_time);
  const end = toDateTime(exam.exam_end_date || exam.exam_start_date, exam.end_time);

  if (!start || !end) return "unknown";

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "past";
}

/**
 * Get remaining time until the exam starts
 */
export function getTimeRemaining(exam) {
  if (!exam?.exam_start_date || !exam?.start_time) return null;

  const start = toDateTime(exam.exam_start_date, exam.start_time);
  if (!start) return null;

  const now = new Date();
  const diff = start - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}
