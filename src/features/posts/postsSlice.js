import { createSlice } from "@reduxjs/toolkit";

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
    }
});

export default postsSlice.reducer;