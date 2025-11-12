import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./auth/UserInfoSlice";
import insttutionYearSlice from "./QusestionBank/insttutionYearSlice";
import statusSlice from "./status/StatusSlice";
import ExamNameSlice from "./GeneratedQuestion/ExamNameSlice";
import selectedQuestionNameSlice from "./SelectedQuestion/SelectedQuestionNameSlice";
import searchSlice from "./Search/SearchSlice";
import languageReducer from "./Language/languageSlice";


const store = configureStore({
  reducer: {
    "language": languageReducer,
    "userInfo": userInfoSlice,
    "institutionYear": insttutionYearSlice,
    "status": statusSlice,
    "examName": ExamNameSlice,
    "selectedQuestionName": selectedQuestionNameSlice,
    "search": searchSlice
  },
});

export default store;
