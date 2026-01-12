import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchPosts } from "../features/posts/postsSlice.js"
import PostsList from "../features/posts/PostsList.jsx"
import SearchBar from "../components/SearchBar.jsx"
import CategoryFilter from "../components/CategoryFilter.jsx"



export default function Home() {
    const dispatch = useDispatch();
    const { selectedCategory, status } = useSelector((state) => state.posts);

    //Home conntrols When to fetch posts
    useEffect(() => {
        if(selectedCategory) {
            dispatch(fetchPosts(selectedCategory));
        }
    }, [selectedCategory, dispatch]);

    return (
        <div className="page">
            <h2>Welcome to Reddit Basic</h2>
            <p>This is a simple Reddit client built with React and Vite .</p>
            <SearchBar />
            <CategoryFilter />
            <PostsList />
        </div>
    )
}