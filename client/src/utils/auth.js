import { decryptData } from "@/utils/decrypt";

export const setTokens = (access, refresh) => {
  if (access) {
    localStorage.setItem("access_token", access);
  }
  if (refresh) {
    localStorage.setItem("refresh_token", refresh);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    return token ? decryptData(token) : null;
  }
  return null;
};

export const refreshToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("refresh_token");
    return token ? decryptData(token) : null;
  }
  return null;
};

export const removeTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

export const toRoman = (num) => {
  const romanMap = [
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 8, numeral: "VIII" },
    { value: 7, numeral: "VII" },
    { value: 6, numeral: "VI" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 3, numeral: "III" },
    { value: 2, numeral: "II" },
    { value: 1, numeral: "I" },
  ];
  let result = "";
  for (const { value, numeral } of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};

export const getDifficultyStyle = (level) => {
  switch (level.toLowerCase()) {
    case "cognitive":
      return { bgColor: "#d1e7dd", textColor: "#0f5132" };
    case "understanding":
      return { bgColor: "#cff4fc", textColor: "#055160" };
    case "applied":
      return { bgColor: "#fff3cd", textColor: "#664d03" };
    case "higher":
      return { bgColor: "#f8d7da", textColor: "#842029" };
    default:
      return { bgColor: "#e2e3e5", textColor: "#41464b" };
  }
};


import { htmlToText } from 'html-to-text';

export default function cleanUsingHtmlToText(html = "") {
  return htmlToText(html, {
    wordwrap: false,
    selectors: [{ selector: 'br', format: 'lineBreak' }]
  });
}


export const getCorrectAnswerText =(question = {})=> {
  return question.answers.find((a) => a.is_correct)?.text || "N/A";
}

export const extractInstitutionKeywords =(usages = [])=> {
  const keywords = new Set();

  usages.forEach((u) => {
    if (u.group) keywords.add(u.group);
    if (u.group_short_name) keywords.add(u.group_short_name);
    if (u.institution) keywords.add(u.institution);
    if (u.institution_short_name) keywords.add(u.institution_short_name);
    if (u.subject) keywords.add(u.subject);
    if (u.year) keywords.add(u.year);
  });

  return Array.from(keywords).join(", ");
}
