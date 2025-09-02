import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const AiSubTask: any = createAsyncThunk('AiSubTask', async (FetchUser: any) => {
    try {
        const { data } = await API.post(API_ENDPOINTS.SUBTASK, FetchUser);
        return data;
    } catch (AiSubTaskError: any) {
        return AiSubTaskError?.response?.data;
    }
});

const AiSubTaskSlice = createSlice({
    name: 'AiSubTask',
    initialState: {
        AiSubTaskRes: [],
        AiSubTaskLoad: false,
        AiSubTaskError: ''
    },
    reducers: {
        reset: (state) => {
            state.AiSubTaskRes = [];
            state.AiSubTaskLoad = false;
            state.AiSubTaskError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AiSubTask.fulfilled, (state: any, action: any) => {
            state.AiSubTaskLoad = false;
            state.AiSubTaskRes = action.payload;
            state.AiSubTaskError = '';
        });

        builder.addCase(AiSubTask.pending, (state: any) => {
            state.AiSubTaskLoad = true;
        });

        builder.addCase(AiSubTask.rejected, (state: any, action: any) => {
            state.AiSubTaskLoad = false;
            state.AiSubTaskRes = [];
            state.AiSubTaskError = action.payload;
        });
    }
});

export const { reset: resetAiSubTask } = AiSubTaskSlice.actions;
export default AiSubTaskSlice.reducer;
