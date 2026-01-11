import { useSelector, useDispatch } from "react-redux"
import { setSearchTerm } from "../features/ui/uiSlice.js"
import PostsList from "../features/posts/PostsList.jsx"


export default function Home() {
    const searchTerm = useSelector((state) => state.ui.searchTerm);
    const dispatch = useDispatch();
    return (
        <div className="page">
            <h2>Welcome to Reddit Basic</h2>
            <p>This is a simple Reddit client built with React and Vite.</p>
            <PostsList />
        </div>
    )
}