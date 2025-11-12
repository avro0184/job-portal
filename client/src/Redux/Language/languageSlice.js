import { createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

const initialState = {
  locale: Cookie.get("locale") || "bn",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.locale = action.payload;
      Cookie.set("locale", action.payload, { expires: 365 }); // Save for 1 year
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
