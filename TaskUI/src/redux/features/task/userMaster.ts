import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const UserData: any = createAsyncThunk('UserData', async (FetchUser: any) => {
    try {
        const { data } = await API.get(API_ENDPOINTS.USERDATA);
        return data;
    } catch (UserDataError: any) {
        return UserDataError?.response?.data;
    }
});

const UserDataSlice = createSlice({
    name: 'UserData',
    initialState: {
        UserDataRes: [],
        UserDataLoad: false,
        UserDataError: ''
    },
    reducers: {
        reset: (state) => {
            state.UserDataRes = [];
            state.UserDataLoad = false;
            state.UserDataError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(UserData.fulfilled, (state: any, action: any) => {
            state.UserDataLoad = false;
            state.UserDataRes = action.payload;
            state.UserDataError = '';
        });

        builder.addCase(UserData.pending, (state: any) => {
            state.UserDataLoad = true;
        });

        builder.addCase(UserData.rejected, (state: any, action: any) => {
            state.UserDataLoad = false;
            state.UserDataRes = [];
            state.UserDataError = action.payload;
        });
    }
});

export const { reset: resetUserData } = UserDataSlice.actions;
export default UserDataSlice.reducer;
