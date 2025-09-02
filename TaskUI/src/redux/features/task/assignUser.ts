import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const assignUser: any = createAsyncThunk('assignUser', async (FetchUser: any) => {
    try {
        const { data } = await API.put(API_ENDPOINTS.ASSIGNEUSER, FetchUser);
        return data;
    } catch (assignUserError: any) {
        return assignUserError?.response?.data;
    }
});

const assignUserSlice = createSlice({
    name: 'assignUser',
    initialState: {
        assignUserRes: [],
        assignUserLoad: false,
        assignUserError: ''
    },
    reducers: {
        reset: (state) => {
            state.assignUserRes = [];
            state.assignUserLoad = false;
            state.assignUserError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(assignUser.fulfilled, (state: any, action: any) => {
            state.assignUserLoad = false;
            state.assignUserRes = action.payload;
            state.assignUserError = '';
        });

        builder.addCase(assignUser.pending, (state: any) => {
            state.assignUserLoad = true;
        });

        builder.addCase(assignUser.rejected, (state: any, action: any) => {
            state.assignUserLoad = false;
            state.assignUserRes = [];
            state.assignUserError = action.payload;
        });
    }
});

export const { reset: resetassignUser } = assignUserSlice.actions;
export default assignUserSlice.reducer;
