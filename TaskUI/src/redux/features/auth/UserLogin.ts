import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const LoginUser: any = createAsyncThunk('LoginUser', async (FetchUser: any) => {
	try {
		const { data } = await API.post(API_ENDPOINTS.USER_LOGIN, FetchUser);
		return data;
	} catch (LoginUserError: any) {
		return LoginUserError?.response?.data;
	}
});

const LoginUserSlice = createSlice({
	name: 'LoginUser',
	initialState: {
		LoginUserRes: [],
		LoginUserLoad: false,
		LoginUserError: ''
	},
	reducers: {
		reset: (state) => {
			state.LoginUserRes = [];
			state.LoginUserLoad = false;
			state.LoginUserError = '';
		}
	},
	extraReducers: (builder) => {
		builder.addCase(LoginUser.fulfilled, (state: any, action: any) => {
			state.LoginUserLoad = false;
			state.LoginUserRes = action.payload;
			state.LoginUserError = '';
		});

		builder.addCase(LoginUser.pending, (state: any) => {
			state.LoginUserLoad = true;
		});

		builder.addCase(LoginUser.rejected, (state: any, action: any) => {
			state.LoginUserLoad = false;
			state.LoginUserRes = [];
			state.LoginUserError = action.payload;
		});
	}
});

export const { reset: resetLoginUser } = LoginUserSlice.actions;
export default LoginUserSlice.reducer;
