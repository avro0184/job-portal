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
    return token 
  }
  return null;
};

export const refreshToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("refresh_token");
    return token 
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