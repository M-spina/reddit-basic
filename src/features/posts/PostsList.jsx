
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "./postsSlice.js";
import PostCard from "./PostCard.jsx";
import "./PostsList.css";

export default function PostsList() {
    const dispatch = useDispatch();
    const { items, status, error, selectedCategory} = useSelector((state) => state.posts);

    // PostList ONly handles display logic and not fetching logic
    if(status === 'loading'){
        return <div className="posts-list__loading">Loading...</div>
    }

    if(status === 'failed'){
        const isRateLimited = error && error.includes('rate limit');
        return (
            <div className="posts-list__error">
                <p>Error: {error}</p>
                {isRateLimited ? (
                    <div className="posts-list__error-hint">
                        <p>You've hit the Reddit API rate limit. Please wait a minute before retrying.</p>
                        <p><strong>What to do:</strong></p>
                        <ul>
                            <li>Wait 1-2 minutes to allow the rate limit to reset.</li>
                            <li>Try again with the button below.</li>
                            <li>Cached posts may still be displayed.</li>
                        </ul>
                    </div>
                ): null}
                <button onClick={() => dispatch(fetchPosts(selectedCategory))} className="posts-list__retry-button">
                    {isRateLimited ? 'Retry After Wait' : 'Retry Fetching Posts'}
                </button>
            </div>
        );
    }

    if(status === 'succeeded' && items.length === 0){
        return <div className="posts-list__empty">No posts available.</div>;
    }

    return (
        <div className="posts-list">
            {items.map((post)=> (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}