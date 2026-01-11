import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "./postsSlice.js";
import PostCard from "./PostCard.jsx";
import "./PostsList.css";

export default function PostsList() {
    const dispatch = useDispatch();
    const { items, status, error} = useSelector((state) => state.posts);

    useEffect(() => {
        if(status === 'idle'){
            dispatch(fetchPosts('popular'));
        }
    }, [status, dispatch]);

    if(status === 'loading'){
        return <div className="posts-list__loading">Loading...</div>
    }

    if(status === 'failed'){
        return (
            <div className="posts-list__error">
                <p>Error: {error}</p>
                <button onClick={() => dispatch(fetchPosts('popular'))}>
                    Retry
                </button>
            </div>
        );
    }

    if(items.length === 0){
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