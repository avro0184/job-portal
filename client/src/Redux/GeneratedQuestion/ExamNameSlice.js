import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiRequest from "@/utils/api";
import toast from "react-hot-toast";

const initialState = {
  examNameList: [],
  loading: false,
  error: null,
  message: null,
};

export const getAllExamName = createAsyncThunk(
  "generatedQuestion/getGeneratedQuestion",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_GET_EXAM_NAMES,
        "GET",
        token,
        null
      );
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      toast.error(error.error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateExamName = createAsyncThunk(
  "generatedQuestion/updateGeneratedQuestion",
  async ({ id, name, is_published, token }, { rejectWithValue }) => {
    try {
      const body = { name };

      // ✅ Only include is_published if provided
      if (typeof is_published !== "undefined") {
        body.is_published = is_published;
      }

      const response = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_GET_EXAM_NAMES}${id}/`,
        "PUT",
        token,
        body
      );

      if (response.success) {
        toast.success(response.message || "Exam updated successfully!");
        return response.data;
      } else {
        toast.error(response.message || "Update failed!");
        return rejectWithValue(response);
      }
    } catch (error) {
      toast.error(error?.error || "Something went wrong!");
      return rejectWithValue(error?.message || "Failed to update exam name");
    }
  }
);

export const deleteExamName = createAsyncThunk(
  "generatedQuestion/deleteGeneratedQuestion",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_GET_EXAM_NAMES}${id}/`,
        "DELETE",
        token
      );
      if (response.success) {
        toast.success(response.message);
        return { id: id };
      }
    } catch (error) {
      toast.error(error.error);
      return rejectWithValue(error.message);
    }
  }
);

export const generatedQuestionSet = createAsyncThunk(
  "generatedQuestion/generatedQuestionSet",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_GET_GENERATED_QUESTION_SETS,
        "POST",
        token,
        data
      );
      if (response.success) {
        toast.success(response.message);
        return response.data;
      }
    } catch (error) {
      toast.error(error.error);
      return rejectWithValue(error.message);
    }
  }
);

export const ExamNameSlice = createSlice({
  name: "allExamName",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExamName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExamName.fulfilled, (state, action) => {
        state.loading = false;
        state.examNameList = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(getAllExamName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.error;
      })
      .addCase(updateExamName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamName.fulfilled, (state, action) => {
        state.loading = false;
        const upd = action.payload;

        const updateArray = (arr) =>
          arr.map((exam) =>
            exam.id === upd.id ? { ...upd, serial: exam.serial } : exam
          );

        if (Array.isArray(state.examNameList)) {
          state.examNameList = updateArray(state.examNameList);
        } else if (state.examNameList?.results) {
          state.examNameList = {
            ...state.examNameList,
            results: updateArray(state.examNameList.results),
          };
        }
      })
      .addCase(updateExamName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteExamName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamName.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.id;

        if (Array.isArray(state.examNameList)) {
          state.examNameList = state.examNameList.filter((e) => e.id !== id);
        } else if (state.examNameList?.results) {
          state.examNameList.results = state.examNameList.results.filter(
            (e) => e.id !== id
          );
        }
      })
      .addCase(deleteExamName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(generatedQuestionSet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatedQuestionSet.fulfilled, (state, action) => {
        state.loading = false;
        state.examNameList = [...state.examNameList, action.payload];
      })
      .addCase(generatedQuestionSet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ExamNameSlice.reducer;
