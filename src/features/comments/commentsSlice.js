import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCommentsFromReddit } from './commentsAPI';

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async ({ subreddit, postId}) => {
        const comments = await fetchCommentsFromReddit(subreddit, postId);
        return comments;
    }
);

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        // we can add reducers here later
        clearComments: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state,action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }

});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;