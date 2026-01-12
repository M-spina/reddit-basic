/**
 * Simple in-memory cache for comments
 */
const commentsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches comments for a Reddit post using the JSON API
 * @param {string} subreddit - The subreddit name
 * @param {string} postId - The Reddit post ID
 * @returns {Promise<Array>} Array of comment objects
 */

export const fetchCommentsFromReddit = async (subreddit, postId) => {
    // check cache first
    const cacheKey = `${subreddit.toLowerCase()}_${postId}`;
    const cached = commentsCache.get(cacheKey);

    if(cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log(`Using cached comments for post ${postId} in r/${subreddit}`);
        return cached.data;
    }

    try{
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/comments/${postId}.json`);

        // Handle rate limiting (429)
        if(response.status === 429) {
            if(cached) {
                console.warn('⚠️ Rate limited - returning stale cache for comments');
                return cached.data;
            }
            throw new Error('Rate limit exceeded. Please wait 1-2 minutes and try again.');
        }
        // Handle subreddit or post not found (404)
        if(response.status === 404) {
            throw new Error(`Post with ID "${postId}" in r/${subreddit} not found. Please check the details.`);
        }
        // Handle forbidden/private subreddit (403)
        if(response.status === 403) {
            throw new Error(`Cannot access comments for post ${postId} in r/${subreddit}. It may be private or restricted.`);
        }
        // Handle other errors
        if(!response.ok) {
            throw new Error(`Failed to fetch comments for post ${postId} in r/${subreddit} (Error ${response.status})`);
        }

        const Data = await response.json();

        //reddit returns an array, first element is post data, second is comments
        // we want the second element which contains the comments
        const commentData = Data[1].data.children;

        // recurisively flatten comments and extract relevant info
        const flattenComments = (commentsList) => {
            const flattened = [];

            commentsList.forEach(item => {
                if(item.kind === 'more') return; // skip 'more' comments

                const comment = item.data;
                flattened.push({
                    id: comment.id,
                    author: comment.author,
                    body: comment.body,
                    score: comment.score,
                    created: comment.created_utc,
                    depth: comment.depth || 0,
                });
                if(comment.replies && comment.replies.data) {
                    const replies = flattenComments(comment.replies.data.children);
                    flattened.push(...replies);
                }
            })
            return flattened;
        };

        const comments = flattenComments(commentData);

        // cache the comments
        commentsCache.set(cacheKey, {
            data: comments,
            timestamp: Date.now()
        });

        console.log(`📥 Fetched fresh comments for post ${postId} in r/${subreddit}`);
        return comments;

    } catch (error) {
        if(!navigator.onLine) {
            throw new Error('You are offline. Please check your internet connection.');
        }
        throw new Error(`Failed to fetch comments for post ${postId} in r/${subreddit}: ${error.message}`);
    }
}