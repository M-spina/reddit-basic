import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPostsFromReddit } from "./postsAPI.js";

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (subreddit = 'popular') => {
        const posts = await fetchPostsFromReddit(subreddit);
        return posts;
    }
);

const initialState ={
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'popular',
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // we can add reducers here later
        setSelectedCategory: (state, action) =>{
            state.selectedCategory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export const { setSelectedCategory } = postsSlice.actions;
export default postsSlice.reducer;