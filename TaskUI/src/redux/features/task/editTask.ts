import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const EditTask: any = createAsyncThunk('EditTask', async (FetchUser: any) => {
    try {
      console.log(FetchUser);
      
         const { data } = await API.put(
        `${API_ENDPOINTS.EDITTASK}${FetchUser.id}`,
        FetchUser.payload
      );
        return data;
    } catch (EditTaskError: any) {
        return EditTaskError?.response?.data;
    }
});

const EditTaskSlice = createSlice({
    name: 'EditTask',
    initialState: {
        EditTaskRes: [],
        EditTaskLoad: false,
        EditTaskError: ''
    },
    reducers: {
        reset: (state) => {
            state.EditTaskRes = [];
            state.EditTaskLoad = false;
            state.EditTaskError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(EditTask.fulfilled, (state: any, action: any) => {
            state.EditTaskLoad = false;
            state.EditTaskRes = action.payload;
            state.EditTaskError = '';
        });

        builder.addCase(EditTask.pending, (state: any) => {
            state.EditTaskLoad = true;
        });

        builder.addCase(EditTask.rejected, (state: any, action: any) => {
            state.EditTaskLoad = false;
            state.EditTaskRes = [];
            state.EditTaskError = action.payload;
        });
    }
});

export const { reset: resetEditTask } = EditTaskSlice.actions;
export default EditTaskSlice.reducer;
