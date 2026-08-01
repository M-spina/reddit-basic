import { describe, expect, it } from 'vitest';
import postsReducer, { fetchPosts } from './postsSlice.js';

describe('posts reducer API state', () => {
    it('moves to loading and clears an earlier error', () => {
        const state = postsReducer(
            {
                items: [],
                status: 'failed',
                error: 'Earlier failure',
                selectedCategory: 'popular',
            },
            { type: fetchPosts.pending.type },
        );

        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    it('stores posts after a successful request', () => {
        const posts = [{ id: 'post-1', title: 'A post' }];
        const state = postsReducer(undefined, {
            type: fetchPosts.fulfilled.type,
            payload: posts,
        });

        expect(state.status).toBe('succeeded');
        expect(state.items).toEqual(posts);
    });

    it('stores the error message after a failed request', () => {
        const state = postsReducer(undefined, {
            type: fetchPosts.rejected.type,
            error: { message: 'Unable to load posts' },
        });

        expect(state.status).toBe('failed');
        expect(state.error).toBe('Unable to load posts');
    });
});
