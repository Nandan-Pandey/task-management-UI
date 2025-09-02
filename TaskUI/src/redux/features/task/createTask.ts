import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const CreateTask: any = createAsyncThunk('CreateTask', async (FetchUser: any) => {
    try {
        const { data } = await API.post(API_ENDPOINTS.CREATETASK, FetchUser);
        return data;
    } catch (CreateTaskError: any) {
        return CreateTaskError?.response?.data;
    }
});

const CreateTaskSlice = createSlice({
    name: 'CreateTask',
    initialState: {
        CreateTaskRes: [],
        CreateTaskLoad: false,
        CreateTaskError: ''
    },
    reducers: {
        reset: (state) => {
            state.CreateTaskRes = [];
            state.CreateTaskLoad = false;
            state.CreateTaskError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(CreateTask.fulfilled, (state: any, action: any) => {
            state.CreateTaskLoad = false;
            state.CreateTaskRes = action.payload;
            state.CreateTaskError = '';
        });

        builder.addCase(CreateTask.pending, (state: any) => {
            state.CreateTaskLoad = true;
        });

        builder.addCase(CreateTask.rejected, (state: any, action: any) => {
            state.CreateTaskLoad = false;
            state.CreateTaskRes = [];
            state.CreateTaskError = action.payload;
        });
    }
});

export const { reset: resetCreateTask } = CreateTaskSlice.actions;
export default CreateTaskSlice.reducer;
