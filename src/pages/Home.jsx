import { useSelector, useDispatch } from "react-redux"
import { setSearchTerm } from "../features/ui/uiSlice.js"


export default function Home() {
    const searchTerm = useSelector((state) => state.ui.searchTerm);
    const dispatch = useDispatch();
    return (
        <div className="page">
            <h2>Welcome to Reddit Basic</h2>
            <p>This is a simple Reddit client built with React and Vite.</p>
            {/*Temporary Redux Test*/}
            <div style={{marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px'}}>
                <h3>Redux Test</h3>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    placeholder="Type to set search term in Redux"
                />
                <p>Current Search Term from Redux: <strong>{searchTerm || 'none'}</strong></p>
            </div>
        </div>
    )
}