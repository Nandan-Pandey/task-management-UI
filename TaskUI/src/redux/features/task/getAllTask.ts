import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const getAllTask: any = createAsyncThunk('getAllTask', async (FetchUser: any) => {
    try {
        const { data } = await API.get(API_ENDPOINTS.GetAlLTASK);
        return data;
    } catch (getAllTaskError: any) {
        return getAllTaskError?.response?.data;
    }
});

const getAllTaskSlice = createSlice({
    name: 'getAllTask',
    initialState: {
        getAllTaskRes: [],
        getAllTaskLoad: false,
        getAllTaskError: ''
    },
    reducers: {
        reset: (state) => {
            state.getAllTaskRes = [];
            state.getAllTaskLoad = false;
            state.getAllTaskError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllTask.fulfilled, (state: any, action: any) => {
            state.getAllTaskLoad = false;
            state.getAllTaskRes = action.payload;
            state.getAllTaskError = '';
        });

        builder.addCase(getAllTask.pending, (state: any) => {
            state.getAllTaskLoad = true;
        });

        builder.addCase(getAllTask.rejected, (state: any, action: any) => {
            state.getAllTaskLoad = false;
            state.getAllTaskRes = [];
            state.getAllTaskError = action.payload;
        });
    }
});

export const { reset: resetgetAllTask } = getAllTaskSlice.actions;
export default getAllTaskSlice.reducer;
