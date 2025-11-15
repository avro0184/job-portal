import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./auth/UserInfoSlice";
import searchSlice from "./Search/SearchSlice";
import languageReducer from "./Language/languageSlice";


const store = configureStore({
  reducer: {
    "language": languageReducer,
    "userInfo": userInfoSlice,
    "search": searchSlice
  },
});

export default store;
