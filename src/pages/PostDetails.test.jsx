import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import commentsReducer from '../features/comments/commentsSlice.js';
import { fetchCommentsFromReddit } from '../features/comments/commentsAPI.js';
import postsReducer from '../features/posts/postsSlice.js';
import { fetchPostByIdFromReddit } from '../features/posts/postsAPI.js';
import PostDetails from './PostDetails.jsx';

vi.mock('../features/posts/postsAPI.js', () => ({
    fetchPostsFromReddit: vi.fn(),
    fetchPostByIdFromReddit: vi.fn(),
}));

vi.mock('../features/comments/commentsAPI.js', () => ({
    fetchCommentsFromReddit: vi.fn(),
}));

const createPost = (overrides = {}) => ({
    id: 'direct123',
    title: 'Direct navigation post',
    author: 'direct-user',
    score: 84,
    numComments: 12,
    thumbnail: 'self',
    url: 'https://www.reddit.com/r/testing/comments/direct123/',
    permalink: '/r/testing/comments/direct123/direct_navigation_post/',
    created: 1234567999,
    subreddit: 'testing',
    selfText: 'Full self-post content',
    isSelf: true,
    postHint: 'self',
    ...overrides,
});

const renderPostRoute = (postId) => {
    const store = configureStore({
        reducer: {
            posts: postsReducer,
            comments: commentsReducer,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[`/post/${postId}`]}>
                <Routes>
                    <Route path="/post/:id" element={<PostDetails />} />
                </Routes>
            </MemoryRouter>
        </Provider>,
    );

    return store;
};

describe('PostDetails direct navigation', () => {
    beforeEach(() => {
        fetchPostByIdFromReddit.mockReset();
        fetchCommentsFromReddit.mockReset();
        fetchCommentsFromReddit.mockResolvedValue([]);
    });

    it('loads a self-text post into an initially empty store', async () => {
        fetchPostByIdFromReddit.mockResolvedValue(createPost());

        renderPostRoute('direct123');

        expect(screen.getByText('Loading post...')).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: 'Direct navigation post' })).toBeInTheDocument();
        expect(screen.getByText('Full self-post content')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'View on Reddit' })).toHaveAttribute(
            'href',
            'https://www.reddit.com/r/testing/comments/direct123/direct_navigation_post/',
        );
        expect(fetchPostByIdFromReddit).toHaveBeenCalledWith('direct123');
        await waitFor(() => {
            expect(fetchCommentsFromReddit).toHaveBeenCalledWith('testing', 'direct123');
        });
    });

    it('renders a full image for direct-image posts', async () => {
        fetchPostByIdFromReddit.mockResolvedValue(createPost({
            id: 'image456',
            title: 'Full image post',
            url: 'https://i.redd.it/full-image.png',
            permalink: '/r/testing/comments/image456/full_image_post/',
            selfText: '',
            isSelf: false,
            postHint: 'image',
        }));

        renderPostRoute('image456');

        const image = await screen.findByRole('img', { name: 'Full image post' });
        expect(image).toHaveAttribute('src', 'https://i.redd.it/full-image.png');
    });

    it('links to external content and the Reddit discussion', async () => {
        fetchPostByIdFromReddit.mockResolvedValue(createPost({
            id: 'link789',
            title: 'External link post',
            url: 'https://example.com/article',
            permalink: '/r/testing/comments/link789/external_link_post/',
            selfText: '',
            isSelf: false,
            postHint: 'link',
        }));

        renderPostRoute('link789');

        expect(await screen.findByRole('link', { name: 'Open linked content' })).toHaveAttribute(
            'href',
            'https://example.com/article',
        );
        expect(screen.getByRole('link', { name: 'View on Reddit' })).toHaveAttribute(
            'href',
            'https://www.reddit.com/r/testing/comments/link789/external_link_post/',
        );
    });

    it('shows a retryable error and recovers after retry', async () => {
        const recoveredPost = createPost({
            id: 'retry-post',
            title: 'Recovered post',
        });
        fetchPostByIdFromReddit
            .mockRejectedValueOnce(new Error('Post could not be loaded'))
            .mockResolvedValueOnce(recoveredPost);
        const user = userEvent.setup();

        renderPostRoute('retry-post');

        expect(await screen.findByText('Post could not be loaded')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Retry' }));

        expect(await screen.findByRole('heading', { name: 'Recovered post' })).toBeInTheDocument();
        expect(fetchPostByIdFromReddit).toHaveBeenCalledTimes(2);
    });
});
