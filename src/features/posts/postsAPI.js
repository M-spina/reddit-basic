/**
 * Fetches posts from a Reddit subreddit using the JSON API
 * @param {string} subreddit - The subreddit name (default: 'popular')
 * @returns {Promise<Array>} Array of post objects
 */

export const fetchPostsFromReddit = async (subreddit = 'popular') => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
    if (!response.ok) {
        throw new Error(`Failed to fetch posts from r/${subreddit}`);
    }
    const data = await response.json();

    return data.data.children.map(post =>({
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

};