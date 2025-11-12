import apiRequest from "@/utils/api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    selectedQuestionNameList: [],
    loading: false,
    error: null,
    message: null
};


export const getAllselectedQuestionName = createAsyncThunk("selectedQuestion/getselectedQuestion", async ({token}, { rejectWithValue }) => {
    try {
        const response = await apiRequest(process.env.NEXT_PUBLIC_API_GET_SELECTED_NAME, "GET", token, null);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        toast.error(error.error);
        return rejectWithValue(error.message);
    }
});

export const updateselectedQuestionName = createAsyncThunk("selectedQuestion/updateselectedQuestion", async ({id , name, token }, { rejectWithValue }) => {
    try {
        const response = await apiRequest(
            `${process.env.NEXT_PUBLIC_API_GET_SELECTED_NAME}${id}/`,
            "PUT",
            token,
            {name}
          );
        if (response.success) {
            toast.success(response.message);
            return response.data;
        }
    } catch (error) {
        toast.error(error.error);
        return rejectWithValue(error.message);
    }
});

export const deleteselectedQuestionName = createAsyncThunk("selectedQuestion/deleteselectedQuestion", async ({ id, token }, { rejectWithValue }) => {
    try {
        const response = await apiRequest(
            `${process.env.NEXT_PUBLIC_API_GET_SELECTED_NAME}${id}/`,
            "DELETE",
            token
        );
        if (response.success) {
            toast.success(response.message);
            return { id : id };
        }
    } catch (error) {
        console.log(error);
        toast.error(error.error);
        return rejectWithValue(error.message);
    }
});


const selectedQuestionNameSlice = createSlice({
    name: "selectedQuestion",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllselectedQuestionName.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllselectedQuestionName.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedQuestionNameList = action.payload;
            })
            .addCase(getAllselectedQuestionName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateselectedQuestionName.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateselectedQuestionName.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedQuestionNameList = state.selectedQuestionNameList.map((selectedQuestion) =>
                    selectedQuestion.id === action.payload.id ? { ...action.payload, serial: selectedQuestion.serial } : selectedQuestion
                );
            })
            .addCase(updateselectedQuestionName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteselectedQuestionName.fulfilled, (state, action) => {
                state.selectedQuestionNameList = state.selectedQuestionNameList.filter((selectedQuestion) => selectedQuestion.id !== action.payload.id);
            });
    },
});

export default selectedQuestionNameSlice.reducer;