/**
 * Simple in-memory cache for Reddit posts
 * Reduces API calls and helps avoid rate limits
 */
const cache = new Map();
const postDetailsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const mapRedditPost = (post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    score: post.score,
    numComments: post.num_comments,
    thumbnail: post.thumbnail,
    url: post.url,
    permalink: post.permalink,
    created: post.created_utc,
    subreddit: post.subreddit,
    selfText: post.selftext || '',
    isSelf: Boolean(post.is_self),
    postHint: post.post_hint || null,
});

/**
 * Fetches posts from a Reddit subreddit using the JSON API
 * @param {string} subreddit - The subreddit name (default: 'popular')
 * @returns {Promise<Array>} Array of post objects
 */

export const fetchPostsFromReddit = async (subreddit = 'popular') => {
    const cacheKey = subreddit.toLocaleLowerCase();
    const cached = cache.get(cacheKey);

    if(cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log(`Using cached posts for r/${subreddit}`);
        return cached.data;
    }

    try{
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json?raw_json=1`);
        
        // Handle rate limiting (429)
        if (response.status === 429) {
            // If rate limited, return cached data if available (even if stale)
            if (cached) {
                console.warn('⚠️ Rate limited - returning stale cache');
                return cached.data;
            }
            throw new Error('Rate limit exceeded. Please wait 1-2 minutes and try again.');
        }
        
        // Handle subreddit not found (404)
        if (response.status === 404) {
            throw new Error(`Subreddit "r/${subreddit}" not found. Please check the name.`);
        }
        
        // Handle forbidden/private subreddit (403)
        if (response.status === 403) {
            throw new Error(`Cannot access r/${subreddit}. It may be private or restricted.`);
        }
        
        // Handle other errors
        if (!response.ok) {
            throw new Error(`Failed to fetch posts from r/${subreddit} (Error ${response.status})`);
        }
        
        const data = await response.json();
        
        const posts = data.data.children.map((post) => mapRedditPost(post.data));
        
        // Store in cache
        cache.set(cacheKey, {
            data: posts,
            timestamp: Date.now()
        });
        
        console.log(`📥 Fetched fresh data for r/${subreddit}`);
        return posts
    } catch (error) {
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }
        throw error;
    }

};

/**
 * Fetches one Reddit post by ID so detail routes work without a loaded feed.
 * @param {string} postId - The Reddit post ID
 * @returns {Promise<Object>} A mapped post object
 */
export const fetchPostByIdFromReddit = async (postId) => {
    const cacheKey = postId.toLocaleLowerCase();
    const cached = postDetailsCache.get(cacheKey);

    if(cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log(`Using cached details for post ${postId}`);
        return cached.data;
    }

    try {
        const response = await fetch(
            `https://www.reddit.com/comments/${encodeURIComponent(postId)}.json?raw_json=1&limit=1`,
        );

        if(response.status === 429) {
            if(cached) {
                console.warn('⚠️ Rate limited - returning stale post details');
                return cached.data;
            }
            throw new Error('Rate limit exceeded. Please wait 1-2 minutes and try again.');
        }

        if(response.status === 404) {
            throw new Error(`Post "${postId}" not found.`);
        }

        if(response.status === 403) {
            throw new Error(`Cannot access post "${postId}". It may be private or restricted.`);
        }

        if(!response.ok) {
            throw new Error(`Failed to fetch post "${postId}" (Error ${response.status})`);
        }

        const data = await response.json();
        const postData = data?.[0]?.data?.children?.[0]?.data;

        if(!postData) {
            throw new Error(`Post "${postId}" not found.`);
        }

        const post = mapRedditPost(postData);

        postDetailsCache.set(cacheKey, {
            data: post,
            timestamp: Date.now(),
        });

        return post;
    } catch (error) {
        if(!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }
        throw error;
    }
};
