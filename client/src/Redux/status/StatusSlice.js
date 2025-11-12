import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "@/utils/api";
import toast from "react-hot-toast";

export const getStatus = createAsyncThunk("status/getStatus", async (token=null, { rejectWithValue }) => {
    try {
        const response = await apiRequest(process.env.NEXT_PUBLIC_API_GET_STATUS, "GET", token, null);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        toast.error(error.error);
        return rejectWithValue(error.message);
    }
});

export const addSelectedName = createAsyncThunk("status/addSelectedName", async ({name , token}, { rejectWithValue }) => {
    try {
        const response = await apiRequest(
            process.env.NEXT_PUBLIC_API_GET_SELECTED_NAME,
            "POST",
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

export const statusSlice = createSlice({
    name: "status",
    initialState: {
        status: [],
        selectedName: [],
        questionDifficulties: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status;
                state.selectedName = action.payload.selectedName;
                state.questionDifficulties = action.payload.questionDifficulties;
            })
            .addCase(getStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSelectedName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSelectedName.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.selectedName)) {
                    state.selectedName = [...state.selectedName, action.payload];
                } else {
                    state.selectedName = [action.payload];
                }
            })
            .addCase(addSelectedName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
            
    }
});

export default statusSlice.reducer;