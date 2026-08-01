import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import postsReducer from '../features/posts/postsSlice.js';
import SearchBar from './SearchBar.jsx';

describe('SearchBar', () => {
    it('uses a submitted search as the selected subreddit', async () => {
        const store = configureStore({
            reducer: {
                posts: postsReducer,
            },
        });
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <SearchBar />
            </Provider>,
        );

        const input = screen.getByPlaceholderText('Search subreddits (e.g., javascript, react.js)');
        await user.type(input, 'reactjs');
        await user.click(screen.getByRole('button', { name: 'Search' }));

        expect(store.getState().posts.selectedCategory).toBe('reactjs');
        expect(input).toHaveValue('');
    });
});
