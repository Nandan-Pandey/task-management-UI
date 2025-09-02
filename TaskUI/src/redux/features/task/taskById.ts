import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const TaskID: any = createAsyncThunk('TaskID', async (FetchUser: any) => {
    try {
        const { data } = await API.get(`${API_ENDPOINTS.TASKBYID}/${FetchUser}`);
        return data;
    } catch (TaskIDError: any) {
        return TaskIDError?.response?.data;
    }
});

const TaskIDSlice = createSlice({
    name: 'TaskID',
    initialState: {
        TaskIDRes: [],
        TaskIDLoad: false,
        TaskIDError: ''
    },
    reducers: {
        reset: (state) => {
            state.TaskIDRes = [];
            state.TaskIDLoad = false;
            state.TaskIDError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(TaskID.fulfilled, (state: any, action: any) => {
            state.TaskIDLoad = false;
            state.TaskIDRes = action.payload;
            state.TaskIDError = '';
        });

        builder.addCase(TaskID.pending, (state: any) => {
            state.TaskIDLoad = true;
        });

        builder.addCase(TaskID.rejected, (state: any, action: any) => {
            state.TaskIDLoad = false;
            state.TaskIDRes = [];
            state.TaskIDError = action.payload;
        });
    }
});

export const { reset: resetTaskID } = TaskIDSlice.actions;
export default TaskIDSlice.reducer;
