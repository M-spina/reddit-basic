import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPostByIdFromReddit, fetchPostsFromReddit } from './postsAPI.js';

const createResponse = ({ status, data }) => ({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
});

describe('fetchPostsFromReddit', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('maps a successful Reddit listing to the app post shape', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        const fetchMock = vi.fn().mockResolvedValue(createResponse({
            status: 200,
            data: {
                data: {
                    children: [{
                        data: {
                            id: 'abc123',
                            title: 'Testing Reddit data',
                            author: 'test-user',
                            score: 42,
                            num_comments: 7,
                            thumbnail: 'https://example.com/thumb.jpg',
                            url: 'https://example.com/story',
                            permalink: '/r/testing/comments/abc123/testing_reddit_data/',
                            created_utc: 1234567890,
                            subreddit: 'testing',
                            selftext: '',
                            is_self: false,
                            post_hint: 'link',
                        },
                    }],
                },
            },
        }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(fetchPostsFromReddit('api-success')).resolves.toEqual([{
            id: 'abc123',
            title: 'Testing Reddit data',
            author: 'test-user',
            score: 42,
            numComments: 7,
            thumbnail: 'https://example.com/thumb.jpg',
            url: 'https://example.com/story',
            permalink: '/r/testing/comments/abc123/testing_reddit_data/',
            created: 1234567890,
            subreddit: 'testing',
            selfText: '',
            isSelf: false,
            postHint: 'link',
        }]);
        expect(fetchMock).toHaveBeenCalledWith(
            'https://www.reddit.com/r/api-success.json?raw_json=1',
        );
    });

    it('reports a missing subreddit', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createResponse({
            status: 404,
            data: {},
        })));

        await expect(fetchPostsFromReddit('missing-community')).rejects.toThrow(
            'Subreddit "r/missing-community" not found. Please check the name.',
        );
    });

    it('reports rate limiting when no cached response exists', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createResponse({
            status: 429,
            data: {},
        })));

        await expect(fetchPostsFromReddit('rate-limited-community')).rejects.toThrow(
            'Rate limit exceeded. Please wait 1-2 minutes and try again.',
        );
    });

    it('reports an offline browser when the request fails', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failed')));

        await expect(fetchPostsFromReddit('offline-community')).rejects.toThrow(
            'No internet connection. Please check your network and try again.',
        );
    });
});

describe('fetchPostByIdFromReddit', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('loads and maps a post without requiring subreddit state', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        const fetchMock = vi.fn().mockResolvedValue(createResponse({
            status: 200,
            data: [{
                data: {
                    children: [{
                        data: {
                            id: 'direct123',
                            title: 'Direct navigation post',
                            author: 'direct-user',
                            score: 84,
                            num_comments: 12,
                            thumbnail: 'self',
                            url: 'https://www.reddit.com/r/testing/comments/direct123/',
                            permalink: '/r/testing/comments/direct123/direct_navigation_post/',
                            created_utc: 1234567999,
                            subreddit: 'testing',
                            selftext: 'Full self-post content',
                            is_self: true,
                            post_hint: 'self',
                        },
                    }],
                },
            }],
        }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(fetchPostByIdFromReddit('direct123')).resolves.toEqual({
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
        });
        expect(fetchMock).toHaveBeenCalledWith(
            'https://www.reddit.com/comments/direct123.json?raw_json=1&limit=1',
        );
    });

    it('rejects an empty listing as a missing post', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createResponse({
            status: 200,
            data: [{ data: { children: [] } }],
        })));

        await expect(fetchPostByIdFromReddit('empty-post')).rejects.toThrow(
            'Post "empty-post" not found.',
        );
    });

    it('reports a missing post response', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createResponse({
            status: 404,
            data: {},
        })));

        await expect(fetchPostByIdFromReddit('unknown-post')).rejects.toThrow(
            'Post "unknown-post" not found.',
        );
    });
});
