import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    items: [],
    status: 'idle',
    error: null,
    selectedCatagory: 'popular',
};

const postsSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // we can add reducers here later
    }
});

export default postsSlice.reducer;