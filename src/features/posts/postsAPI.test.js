import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPostsFromReddit } from './postsAPI.js';

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
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createResponse({
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
                        },
                    }],
                },
            },
        })));

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
        }]);
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
