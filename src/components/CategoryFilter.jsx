import { useSelector, useDispatch } from "react-redux";
import { setSelectedCategory } from "../features/posts/postsSlice";
import '../styles/CategoryFilter.css';

const CATEGORIES = [
    {id: 'popular', label: '🔥 Popular'},
    {id: 'javascript', label: '💻 JavaScript'}, 
    {id: 'reactjs', label: ' ⚛️ ReactJS'},
    {id: 'webdev', label: '🌐 WebDev'},
    {id: 'programming', label: '👨‍💻  Programming'},
    {id: 'technology', label: '🖥️ Technology'},
];

export default function CategoryFilter() {
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.posts.selectedCategory);

    const handleCategoryChange = (category) => {
        // update selected category in the store
        dispatch(setSelectedCategory(category));
        // Home.jsx will react to this change and fetch
    };

    return (
        <div className="category-filter">
            <h3 className="category-filter__title">Categories</h3>
            <div className="category-filter__buttons">
                {CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        className={`category-filter__button 
                            ${selectedCategory === category.id ? 'category-filter__button--active' : ''     
                        }`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}