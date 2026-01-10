import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        // we can add reducers here later
    },

});

export default commentsSlice.reducer;