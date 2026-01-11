import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchPosts } from "../features/posts/postsSlice.js"
import PostsList from "../features/posts/PostsList.jsx"
import { s } from "framer-motion/client";


export default function Home() {
    const dispatch = useDispatch();
    const { selectCategory, status } = useSelector((state) => state.posts);

    //Home conntrols When to fetch posts
    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchPosts(selectCategory));
        }
    }, [status, selectCategory, dispatch]);

    return (
        <div className="page">
            <h2>Welcome to Reddit Basic</h2>
            <p>This is a simple Reddit client built with React and Vite 2.</p>
            <PostsList />
        </div>
    )
}