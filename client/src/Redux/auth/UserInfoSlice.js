import apiRequest from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  userInfo: null,
  token: null,
  loading: false,
  error: null,
};

// ✅ Fetch user info
export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_GET_USER_INFO,
        "GET",
        token,
        null
      );
      return { data: response?.data, token };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load profile");
    }
  }
);


const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    } 
   },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        toast.error(state.error);
      });
  },
});

export const { clearUserInfo , updateRemainingQuestionsLocal } = userInfoSlice.actions;
export default userInfoSlice.reducer;
