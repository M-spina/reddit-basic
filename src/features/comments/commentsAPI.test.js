import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCommentsFromReddit } from './commentsAPI.js';

describe('fetchCommentsFromReddit', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('flattens nested comments in display order and preserves depth', async () => {
        vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue([
                {},
                {
                    data: {
                        children: [
                            {
                                kind: 't1',
                                data: {
                                    id: 'parent',
                                    author: 'parent-user',
                                    body: 'Parent comment',
                                    score: 10,
                                    created_utc: 100,
                                    depth: 0,
                                    replies: {
                                        data: {
                                            children: [
                                                {
                                                    kind: 't1',
                                                    data: {
                                                        id: 'child',
                                                        author: 'child-user',
                                                        body: 'Child comment',
                                                        score: 5,
                                                        created_utc: 101,
                                                        depth: 1,
                                                        replies: '',
                                                    },
                                                },
                                                {
                                                    kind: 'more',
                                                    data: { id: 'more-comments' },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            ]),
        }));

        await expect(fetchCommentsFromReddit('testing', 'nested-post')).resolves.toEqual([
            {
                id: 'parent',
                author: 'parent-user',
                body: 'Parent comment',
                score: 10,
                created: 100,
                depth: 0,
            },
            {
                id: 'child',
                author: 'child-user',
                body: 'Child comment',
                score: 5,
                created: 101,
                depth: 1,
            },
        ]);
    });
});
