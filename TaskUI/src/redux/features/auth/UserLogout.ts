import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import { API_ENDPOINTS } from '../../../shared/api-endpoints';

export const UserLogoutApi: any = createAsyncThunk('UserLogoutApiList', async () => {
	try {
		const { data } = await API.get(API_ENDPOINTS.USER_LOGIN);
		return data;
	} catch (userLoginApiError: any) {
		return userLoginApiError?.response?.data;
	}
});
const userLogoutApiSlice = createSlice({
	name: 'UserLogoutApiList',
	initialState: {
		userLogoutApiRes: [],
		userLogoutApiLoad: false,
		userLogoutApiError: ''
	},
	reducers: {
		reset: (state) => {
			state.userLogoutApiRes = [];
			state.userLogoutApiLoad = false;
			state.userLogoutApiError = '';
		}
	},
	extraReducers: (builder) => {
		builder.addCase(UserLogoutApi.fulfilled, (state: any, action: any) => {
			state.userLogoutApiLoad = false;
			state.userLogoutApiRes = action.payload;
			state.userLogoutApiError = '';
		});

		builder.addCase(UserLogoutApi.pending, (state: any) => {
			state.userLogoutApiLoad = true;
		});

		builder.addCase(UserLogoutApi.rejected, (state: any, action: any) => {
			state.userLogoutApiLoad = false;
			state.userLogoutApiRes = [];
			state.userLogoutApiError = action.payload;
		});
	}
});

export const { reset: resetUserLogoutApi } = userLogoutApiSlice.actions;
export default userLogoutApiSlice.reducer;
