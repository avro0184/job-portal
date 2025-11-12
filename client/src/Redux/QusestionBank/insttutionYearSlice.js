import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiRequest from "@/utils/api";
import { decryptData } from "@/utils/decrypt";

const initialState = {
  years: [],
  groups: [],
  loading: false,
  error: null,
};

// ✅ Async Thunk for fetching Institution + Year info
export const InstitutionYearInfo = createAsyncThunk(
  "questionBank/InstitutionYearInfo",
  async ({token}, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_INSTITUTION_YEAR,
        "GET",
        token,
        null
      );
      return {
        groups : decryptData(response?.data?.groups) || [],
        years : decryptData(response?.data?.years) || []
      };
    } catch (error) {
      toast.error(error?.error || "Something went wrong");
      return rejectWithValue(error?.error || "Failed to fetch data");
    }
  }
);

// ✅ Slice
const institutionYearSlice = createSlice({
  name: "questionBank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(InstitutionYearInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(InstitutionYearInfo.fulfilled, (state, action) => {
        state.groups = action.payload?.groups;
        state.years = action.payload?.years;
        state.loading = false;
        state.questionBank = action.payload;
      })
      .addCase(InstitutionYearInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default institutionYearSlice.reducer;
