import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const DeleteAPI: any = createAsyncThunk('DeleteAPI', async (FetchUser: any) => {
    try {
        const { data } = await API.delete(`${API_ENDPOINTS.DELETETASK}/${FetchUser}`);
        return data;
    } catch (DeleteAPIError: any) {
        return DeleteAPIError?.response?.data;
    }
});

const DeleteAPISlice = createSlice({
    name: 'DeleteAPI',
    initialState: {
        DeleteAPIRes: [],
        DeleteAPILoad: false,
        DeleteAPIError: ''
    },
    reducers: {
        reset: (state) => {
            state.DeleteAPIRes = [];
            state.DeleteAPILoad = false;
            state.DeleteAPIError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(DeleteAPI.fulfilled, (state: any, action: any) => {
            state.DeleteAPILoad = false;
            state.DeleteAPIRes = action.payload;
            state.DeleteAPIError = '';
        });

        builder.addCase(DeleteAPI.pending, (state: any) => {
            state.DeleteAPILoad = true;
        });

        builder.addCase(DeleteAPI.rejected, (state: any, action: any) => {
            state.DeleteAPILoad = false;
            state.DeleteAPIRes = [];
            state.DeleteAPIError = action.payload;
        });
    }
});

export const { reset: resetDeleteAPI } = DeleteAPISlice.actions;
export default DeleteAPISlice.reducer;
