import { describe, expect, it } from 'vitest';
import postsReducer, {
    clearPostDetail,
    fetchPostById,
    fetchPosts,
} from './postsSlice.js';

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

describe('post detail reducer state', () => {
    it('tracks a successful by-ID request', () => {
        const pendingState = postsReducer(undefined, {
            type: fetchPostById.pending.type,
            meta: { arg: 'direct123' },
        });

        expect(pendingState.detail).toEqual({
            item: null,
            requestedId: 'direct123',
            status: 'loading',
            error: null,
        });

        const post = { id: 'direct123', title: 'Direct post' };
        const fulfilledState = postsReducer(pendingState, {
            type: fetchPostById.fulfilled.type,
            payload: post,
            meta: { arg: 'direct123' },
        });

        expect(fulfilledState.detail.item).toEqual(post);
        expect(fulfilledState.detail.status).toBe('succeeded');
    });

    it('stores a current failure and ignores a response for another route', () => {
        const pendingState = postsReducer(undefined, {
            type: fetchPostById.pending.type,
            meta: { arg: 'current-post' },
        });
        const staleState = postsReducer(pendingState, {
            type: fetchPostById.fulfilled.type,
            payload: { id: 'stale-post' },
            meta: { arg: 'stale-post' },
        });

        expect(staleState).toEqual(pendingState);

        const failedState = postsReducer(staleState, {
            type: fetchPostById.rejected.type,
            error: { message: 'Post request failed' },
            meta: { arg: 'current-post' },
        });

        expect(failedState.detail.status).toBe('failed');
        expect(failedState.detail.error).toBe('Post request failed');
    });

    it('clears route-specific detail state', () => {
        const pendingState = postsReducer(undefined, {
            type: fetchPostById.pending.type,
            meta: { arg: 'direct123' },
        });
        const clearedState = postsReducer(pendingState, clearPostDetail());

        expect(clearedState.detail).toEqual({
            item: null,
            requestedId: null,
            status: 'idle',
            error: null,
        });
    });
});
