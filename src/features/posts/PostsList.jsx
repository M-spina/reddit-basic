
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "./postsSlice.js";
import PostCard from "./PostCard.jsx";
import PostsSkeleton from "./PostsSkeleton.jsx";
import ErrorState from "../ui/ErrorState.jsx";
import "./PostsList.css";

export default function PostsList() {
    const dispatch = useDispatch();
    const { items, status, error, selectedCategory} = useSelector((state) => state.posts);

    // show skeleton while loading
    if(status === 'loading'){
        return <PostsSkeleton count={5} />;
    }

    // show error state
    if(status === 'failed'){
        const isRateLimited = error && error.includes('rate limit');
        return (
            <ErrorState
                error={error}
                onRetry={() => dispatch(fetchPosts(selectedCategory))}
                showHints={true}
            />
        );
    }

    if(items.length === 0){
        return (
            <div className="posts-list__empty">
                <p>No posts available for<strong>r/{selectedCategory}</strong>.</p>
                <p>Try searching for a different category.</p>
            </div>);
    }

    return (
        <div className="posts-list">
            {items.map((post)=> (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}