/**
 * Simple in-memory cache for Reddit posts
 * Reduces API calls and helps avoid rate limits
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        
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
        
        const posts = data.data.children.map(post => ({
            id: post.data.id,
            title: post.data.title,
            author: post.data.author,
            score: post.data.score,
            numComments: post.data.num_comments,
            thumbnail: post.data.thumbnail,
            url: post.data.url,
            permalink: post.data.permalink,
            created: post.data.created_utc,
            subreddit: post.data.subreddit,
        }));
        
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