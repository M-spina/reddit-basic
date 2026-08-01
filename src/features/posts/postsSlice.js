import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPostByIdFromReddit, fetchPostsFromReddit } from "./postsAPI.js";

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (subreddit = 'popular') => {
        const posts = await fetchPostsFromReddit(subreddit);
        return posts;
    }
);

export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async (postId) => {
        const post = await fetchPostByIdFromReddit(postId);
        return post;
    }
);

const initialDetailState = {
    item: null,
    requestedId: null,
    status: 'idle',
    error: null,
};

const initialState ={
    items: [],
    status: 'idle',
    error: null,
    selectedCategory: 'popular',
    detail: initialDetailState,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // we can add reducers here later
        setSelectedCategory: (state, action) =>{
            state.selectedCategory = action.payload;
        },
        clearPostDetail: (state) => {
            state.detail = { ...initialDetailState };
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
            .addCase(fetchPostById.pending, (state, action) => {
                state.detail.item = null;
                state.detail.requestedId = action.meta.arg;
                state.detail.status = 'loading';
                state.detail.error = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                if(state.detail.requestedId !== action.meta.arg) return;

                state.detail.item = action.payload;
                state.detail.status = 'succeeded';
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                if(state.detail.requestedId !== action.meta.arg) return;

                state.detail.status = 'failed';
                state.detail.error = action.error.message;
            })
    }
});

export const { clearPostDetail, setSelectedCategory } = postsSlice.actions;
export default postsSlice.reducer;
