import { useState} from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../features/posts/postsSlice';
import { setSearchTerm } from '../features/ui/uiSlice';
import '../styles/SearchBar.css';

export default function SearchBar() {
    const [localSearch, setLocalSearch] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(localSearch.trim() !== '') {
            dispatch(setSearchTerm(localSearch));
            dispatch(fetchPosts(localSearch));
        }
    };

    return (
        <form className='search-bar' onSubmit={handleSubmit}>
            <input
                type="text"
                className="search-bar__input"
                placeholder='Search subreddits (e.g., javascript, react.js)...'
                value={localSearch}
                onChange = {(e) => setLocalSearch(e.target.value)}
            />
            <button type="submit" className="search-bar__button">Search</button>
        </form>
    )
}