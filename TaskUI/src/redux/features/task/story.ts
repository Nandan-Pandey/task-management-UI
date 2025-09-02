import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../../config/axios.config';
import {  API_ENDPOINTS,  } from '../../../shared/api-endpoints';

export const AiStory: any = createAsyncThunk('AiStory', async (FetchUser: any) => {
    try {
        const { data } = await API.post(API_ENDPOINTS.STORY, FetchUser);
        return data;
    } catch (AiStoryError: any) {
        return AiStoryError?.response?.data;
    }
});

const AiStorySlice = createSlice({
    name: 'AiStory',
    initialState: {
        AiStoryRes: [],
        AiStoryLoad: false,
        AiStoryError: ''
    },
    reducers: {
        reset: (state) => {
            state.AiStoryRes = [];
            state.AiStoryLoad = false;
            state.AiStoryError = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AiStory.fulfilled, (state: any, action: any) => {
            state.AiStoryLoad = false;
            state.AiStoryRes = action.payload;
            state.AiStoryError = '';
        });

        builder.addCase(AiStory.pending, (state: any) => {
            state.AiStoryLoad = true;
        });

        builder.addCase(AiStory.rejected, (state: any, action: any) => {
            state.AiStoryLoad = false;
            state.AiStoryRes = [];
            state.AiStoryError = action.payload;
        });
    }
});

export const { reset: resetAiStory } = AiStorySlice.actions;
export default AiStorySlice.reducer;
