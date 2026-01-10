import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchTerm: '',
    error: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setSearchTerm, setError, clearError } = uiSlice.actions;

export default uiSlice.reducer;